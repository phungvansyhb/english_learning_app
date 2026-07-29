"use client"

import { useMemo, useState } from "react"
import { Pencil, Plus, Search, Trash2, Volume2 } from "lucide-react"

import type { Word } from "@/lib/types"
import { seedWords } from "@/lib/words-data"
import { cn } from "@/lib/utils"
import { Modal } from "@/components/admin/modal"
import { WordFormModal } from "@/components/admin/word-form-modal"

const difficultyTone: Record<number, string> = {
  1: "bg-brand-mint text-brand-mint-foreground",
  2: "bg-brand-purple text-accent-foreground",
  3: "bg-brand-orange text-foreground",
  4: "bg-brand-pink text-primary-foreground",
  5: "bg-primary text-primary-foreground",
}

export function WordsManager() {
  const [words, setWords] = useState<Word[]>(seedWords)
  const [query, setQuery] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Word | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Word | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? words.filter(
          (w) =>
            w.word.toLowerCase().includes(q) ||
            w.meanings.some((m) => m.meaning.toLowerCase().includes(q)),
        )
      : words
    return [...list].sort((a, b) => a.order_index - b.order_index)
  }, [words, query])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(word: Word) {
    setEditing(word)
    setFormOpen(true)
  }

  function handleSave(word: Word) {
    setWords((prev) => {
      const exists = prev.some((w) => w.id === word.id)
      return exists ? prev.map((w) => (w.id === word.id ? word : w)) : [...prev, word]
    })
    setFormOpen(false)
    setEditing(null)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setWords((prev) => prev.filter((w) => w.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-4 sm:p-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Words</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {words.length} {words.length === 1 ? "entry" : "entries"} in the vocabulary library
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search words"
              aria-label="Search words"
              className="h-11 w-full rounded-full border border-border bg-secondary/50 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30"
            />
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add word</span>
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-border md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Word</th>
              <th className="px-4 py-3 font-semibold">Meaning</th>
              <th className="px-4 py-3 font-semibold">Difficulty</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((word) => (
              <tr key={word.id} className="border-t border-border align-top">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{word.word}</span>
                    {(word.audio_uk || word.audio_us) && (
                      <Volume2 className="size-3.5 text-muted-foreground" aria-label="Has audio" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{word.ipa}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {word.meanings.slice(0, 3).map((m, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground"
                      >
                        <span className="text-muted-foreground">{m.pos}</span> · {m.meaning}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      difficultyTone[word.difficulty_level] ?? difficultyTone[1],
                    )}
                  >
                    Level {word.difficulty_level}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{word.order_index}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(word)}
                      aria-label={`Edit ${word.word}`}
                      className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(word)}
                      aria-label={`Delete ${word.word}`}
                      className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState onCreate={openCreate} />}
      </div>

      {/* Mobile cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {filtered.map((word) => (
          <div key={word.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{word.word}</span>
                  {(word.audio_uk || word.audio_us) && (
                    <Volume2 className="size-3.5 text-muted-foreground" aria-label="Has audio" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{word.ipa}</span>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                  difficultyTone[word.difficulty_level] ?? difficultyTone[1],
                )}
              >
                Level {word.difficulty_level}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {word.meanings.map((m, i) => (
                <span
                  key={i}
                  className="rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground"
                >
                  <span className="text-muted-foreground">{m.pos}</span> · {m.meaning}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(word)}
                className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <Pencil className="size-4" /> Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(word)}
                aria-label={`Delete ${word.word}`}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState onCreate={openCreate} />}
      </div>

      <WordFormModal
        open={formOpen}
        word={editing}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete word"
        description={`This will permanently remove "${deleteTarget?.word}".`}
      >
        <div className="flex justify-end gap-3 px-6 py-5">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="h-11 rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="h-11 rounded-full bg-destructive px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </Modal>
    </section>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <p className="text-sm text-muted-foreground">No words match your search.</p>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
      >
        <Plus className="size-4" /> Add a word
      </button>
    </div>
  )
}
