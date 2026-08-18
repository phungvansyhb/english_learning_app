'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLookedUpStore } from '@/utils/zustand/looked-up-store'

const HIGHLIGHT_NAME = 'looked-up'

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** The CSS Custom Highlight API is required to paint ranges without DOM edits. */
function supportsHighlightApi() {
    return (
        typeof CSS !== 'undefined' &&
        'highlights' in CSS &&
        typeof Highlight !== 'undefined'
    )
}

/**
 * Paints every occurrence of a looked-up term inside `containerRef` using the
 * CSS Custom Highlight API. Nothing is injected into the DOM — ranges are
 * registered with `CSS.highlights` and styled via `::highlight(looked-up)`.
 * Re-runs when the store changes, the route changes, or the content mutates.
 */
export function LookedUpHighlighter({
    containerRef,
}: {
    containerRef: React.RefObject<HTMLElement | null>
}) {
    const words = useLookedUpStore((state) => state.words)
    const pathname = usePathname()

    useEffect(() => {
        if (!supportsHighlightApi()) return
        const container = containerRef.current
        if (!container) return

        let frame = 0

        const paint = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                if (words.length === 0) {
                    CSS.highlights.delete(HIGHLIGHT_NAME)
                    return
                }

                // Longest-first so multi-word terms win over their sub-words.
                const pattern = words
                    .map(escapeRegExp)
                    .sort((a, b) => b.length - a.length)
                    .join('|')
                const regex = new RegExp(
                    `(?<![\\p{L}\\p{N}])(?:${pattern})(?![\\p{L}\\p{N}])`,
                    'giu',
                )

                const walker = document.createTreeWalker(
                    container,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode(node) {
                            if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT
                            const el = node.parentElement
                            if (!el) return NodeFilter.FILTER_REJECT
                            if (
                                el.closest(
                                    'script,style,textarea,input,select,button,[data-no-highlight]',
                                )
                            ) {
                                return NodeFilter.FILTER_REJECT
                            }
                            return NodeFilter.FILTER_ACCEPT
                        },
                    },
                )

                const ranges: Range[] = []
                let node: Node | null
                while ((node = walker.nextNode())) {
                    const text = node.nodeValue as string
                    regex.lastIndex = 0
                    let match: RegExpExecArray | null
                    while ((match = regex.exec(text))) {
                        const range = new Range()
                        range.setStart(node, match.index)
                        range.setEnd(node, match.index + match[0].length)
                        ranges.push(range)
                        if (match[0].length === 0) regex.lastIndex++
                    }
                }

                if (ranges.length) {
                    CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(...ranges))
                } else {
                    CSS.highlights.delete(HIGHLIGHT_NAME)
                }
            })
        }

        paint()

        // Repaint when the page content changes (route transitions, async data).
        const observer = new MutationObserver(paint)
        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true,
        })

        return () => {
            observer.disconnect()
            cancelAnimationFrame(frame)
        }
    }, [words, pathname, containerRef])

    useEffect(() => {
        return () => {
            if (supportsHighlightApi()) CSS.highlights.delete(HIGHLIGHT_NAME)
        }
    }, [])

    return null
}
