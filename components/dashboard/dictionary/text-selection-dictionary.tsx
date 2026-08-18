"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { BookOpenText } from "lucide-react"
import { lookupWord, type DictionaryEntry } from "@/lib/dictionary-data"
import { useLookedUpStore } from "@/utils/zustand/looked-up-store"
import { DictionaryPopup } from "./dictionary-popup"
import { LookedUpHighlighter } from "./looked-up-highlighter"

type Position = { top: number; left: number }
type TriggerState = { position: Position; text: string } | null
type PopupState = { position: Position; entry: DictionaryEntry } | null

const POPUP_WIDTH = 352 // 22rem
const POPUP_MAX_HEIGHT = 512 // 32rem
const TRIGGER_SIZE = 36
const GAP = 8

/**
 * Listens for text selection anywhere inside its subtree and shows a small
 * lookup trigger. Clicking it opens the dictionary popup positioned near the
 * selection, kept within the viewport.
 */
export function TextSelectionDictionary({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [trigger, setTrigger] = useState<TriggerState>(null)
  const [popup, setPopup] = useState<PopupState>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markLookedUp = useLookedUpStore((state) => state.markLookedUp)

  useEffect(() => setMounted(true), [])

  const clearAll = useCallback(() => {
    setTrigger(null)
    setPopup(null)
  }, [])

  const handleSelection = useCallback(() => {
    if (popup) return
    const selection = window.getSelection()
    const text = selection?.toString().trim() ?? ""

    if (!selection || selection.rangeCount === 0 || text.length === 0 || text.length > 60) {
      setTrigger(null)
      return
    }

    const anchor = selection.anchorNode
    if (anchor && containerRef.current && !containerRef.current.contains(anchor)) {
      setTrigger(null)
      return
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return

    const left = Math.min(
      Math.max(GAP, rect.left + rect.width / 2 - TRIGGER_SIZE / 2),
      window.innerWidth - TRIGGER_SIZE - GAP,
    )
    const top = Math.max(GAP, rect.top - TRIGGER_SIZE - GAP)
    setTrigger({ position: { top, left }, text })
  }, [popup])

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection)
    document.addEventListener("keyup", handleSelection)
    return () => {
      document.removeEventListener("mouseup", handleSelection)
      document.removeEventListener("keyup", handleSelection)
    }
  }, [handleSelection])

  useEffect(() => {
    if (!popup) return
    const onScroll = () => setPopup(null)
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && clearAll()
    window.addEventListener("scroll", onScroll, true)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("keydown", onKey)
    }
  }, [popup, clearAll])

  const openPopup = () => {
    if (!trigger) return
    const entry = lookupWord(trigger.text)
    markLookedUp(trigger.text)

    const left = Math.min(
      Math.max(GAP, trigger.position.left - POPUP_WIDTH / 2 + TRIGGER_SIZE / 2),
      window.innerWidth - POPUP_WIDTH - GAP,
    )
    const spaceBelow = window.innerHeight - trigger.position.top
    const top =
      spaceBelow < POPUP_MAX_HEIGHT + GAP
        ? Math.max(GAP, window.innerHeight - POPUP_MAX_HEIGHT - GAP)
        : trigger.position.top + TRIGGER_SIZE + GAP

    setPopup({ position: { top, left }, entry })
    setTrigger(null)
  }

  return (
    <div ref={containerRef}>
      {children}
      <LookedUpHighlighter containerRef={containerRef} />
      {mounted &&
        trigger &&
        !popup &&
        createPortal(
          <button
            style={{ top: trigger.position.top, left: trigger.position.left }}
            onMouseDown={(event) => event.preventDefault()}
            onClick={openPopup}
            aria-label={`Tra từ "${trigger.text}"`}
            className="fixed z-[60] flex size-9 animate-in fade-in zoom-in-95 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-1 ring-foreground/10 transition-transform hover:scale-105"
          >
            <BookOpenText className="size-4" />
          </button>,
          document.body,
        )}
      {mounted &&
        popup &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[60]" onMouseDown={clearAll} aria-hidden />
            <div
              style={{ top: popup.position.top, left: popup.position.left }}
              className="fixed z-[61] animate-in fade-in zoom-in-95"
            >
              <DictionaryPopup entry={popup.entry} onClose={clearAll} />
            </div>
          </>,
          document.body,
        )}
    </div>
  )
}
