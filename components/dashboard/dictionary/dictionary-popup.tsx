"use client"

import { useState } from "react"
import { BookOpen, Check, ChevronDown, Plus, Sparkles, Volume2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type DictionaryEntry,
  type DictionaryMeaning,
  posLabels,
} from "@/lib/dictionary-data"

type TabKey = "meaning" | "phrases" | "examples" | "synonyms" | "family"

const tabs: { key: TabKey; label: string }[] = [
  { key: "meaning", label: "Nghĩa" },
  { key: "phrases", label: "Cụm từ" },
  { key: "examples", label: "Ví dụ" },
  { key: "synonyms", label: "Đồng nghĩa" },
  { key: "family", label: "Họ từ" },
]

const studySets = ["Giới từ · Học phần riêng", "Từ vựng TOEIC", "Business English", "Daily words"]

function speak(text: string, lang = "en-US") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export function DictionaryPopup({
  entry,
  onClose,
}: {
  entry: DictionaryEntry
  onClose: () => void
}) {
  const [tab, setTab] = useState<TabKey>("meaning")
  const [withExamples, setWithExamples] = useState(true)
  const [addToCart, setAddToCart] = useState(false)
  const [learnOther, setLearnOther] = useState(true)
  const [added, setAdded] = useState<string[]>([])
  const [studySet, setStudySet] = useState(studySets[0])

  const toggleAdd = (id: string) =>
    setAdded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <div className="flex max-h-[32rem] w-[22rem] flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-2xl ring-1 ring-foreground/10">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight">{entry.word}</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-purple/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
            <Sparkles className="size-3" /> AI-VI
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Đóng từ điển"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Pronunciation */}
      <div className="flex flex-wrap items-center gap-4 px-4 pb-3 pt-1 text-sm text-muted-foreground">
        <button
          onClick={() => speak(entry.word, "en-US")}
          className="flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <Volume2 className="size-4 text-primary" />
          <span className="font-medium text-foreground">US</span> {entry.ipaUs}
        </button>
        <button
          onClick={() => speak(entry.word, "en-GB")}
          className="flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <Volume2 className="size-4 text-primary" />
          <span className="font-medium text-foreground">UK</span> {entry.ipaUk}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b px-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={cn(
              "relative px-2.5 py-2 text-xs font-semibold transition-colors",
              tab === item.key
                ? "text-primary after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tab === "meaning" && (
          <MeaningTab
            entry={entry}
            withExamples={withExamples}
            setWithExamples={setWithExamples}
            added={added}
            toggleAdd={toggleAdd}
          />
        )}

        {tab === "phrases" && (
          <ul className="flex flex-col gap-2">
            {entry.phrases.length ? (
              entry.phrases.map((phrase) => (
                <li
                  key={phrase.text}
                  className="rounded-xl bg-secondary px-3 py-2.5 text-sm"
                >
                  <span className="font-semibold text-foreground">{phrase.text}</span>
                  <span className="text-muted-foreground"> — {phrase.meaning}</span>
                </li>
              ))
            ) : (
              <EmptyState label="Chưa có cụm từ" />
            )}
          </ul>
        )}

        {tab === "examples" && (
          <ul className="flex flex-col gap-3">
            {entry.groups
              .flatMap((group) => group.meanings)
              .flatMap((meaning) => meaning.examples)
              .map((example, index) => (
                <li key={index} className="rounded-xl bg-secondary px-3 py-2.5 text-sm">
                  <p className="leading-6 text-foreground">{example.en}</p>
                  <p className="mt-1 italic leading-6 text-muted-foreground">{example.vi}</p>
                </li>
              ))}
          </ul>
        )}

        {tab === "synonyms" && (
          <div className="flex flex-wrap gap-2">
            {entry.synonyms.length ? (
              entry.synonyms.map((synonym) => (
                <span
                  key={synonym}
                  className="rounded-full bg-brand-mint/40 px-3 py-1 text-sm font-medium text-brand-mint-foreground"
                >
                  {synonym}
                </span>
              ))
            ) : (
              <EmptyState label="Chưa có từ đồng nghĩa" />
            )}
          </div>
        )}

        {tab === "family" && (
          <ul className="flex flex-col gap-2">
            {entry.family.length ? (
              entry.family.map((item) => (
                <li
                  key={item.word}
                  className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5 text-sm"
                >
                  <span className="font-semibold text-foreground">{item.word}</span>
                  <span className="text-xs text-muted-foreground">{posLabels[item.pos]}</span>
                </li>
              ))
            ) : (
              <EmptyState label="Chưa có họ từ" />
            )}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/40 px-4 py-3">
        <div className="mb-3 flex items-center justify-between text-sm">
          <CheckboxRow checked={addToCart} onChange={setAddToCart} label="Vào giỏ" />
          <CheckboxRow checked={learnOther} onChange={setLearnOther} label="Học phần khác" />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={studySet}
              onChange={(event) => setStudySet(event.target.value)}
              aria-label="Chọn học phần"
              className="h-9 w-full appearance-none rounded-lg border bg-card px-3 pr-8 text-sm font-medium text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
            >
              {studySets.map((set) => (
                <option key={set} value={set}>
                  {set}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <button className="inline-flex h-9 items-center gap-1 rounded-lg border px-2.5 text-sm font-medium transition-colors hover:bg-muted">
            <Plus className="size-4" /> Mới
          </button>
          <button
            aria-label="Mở học phần"
            className="inline-flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <BookOpen className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function MeaningTab({
  entry,
  withExamples,
  setWithExamples,
  added,
  toggleAdd,
}: {
  entry: DictionaryEntry
  withExamples: boolean
  setWithExamples: (value: boolean) => void
  added: string[]
  toggleAdd: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <CheckboxRow
        checked={withExamples}
        onChange={setWithExamples}
        label="Kèm ví dụ khi thêm từ"
      />

      <button className="flex items-center justify-between rounded-xl border border-dashed border-primary/40 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5">
        <span className="flex items-center gap-2">
          <Plus className="size-4" /> Thêm nghĩa riêng của bạn
        </span>
        <Plus className="size-4" />
      </button>

      {entry.groups.map((group) => (
        <div key={group.pos} className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-orange">
            {group.pos}
          </p>
          {group.meanings.map((meaning) => (
            <MeaningCard
              key={meaning.meaning}
              id={`${group.pos}-${meaning.meaning}`}
              meaning={meaning}
              withExamples={withExamples}
              added={added}
              toggleAdd={toggleAdd}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function MeaningCard({
  id,
  meaning,
  withExamples,
  added,
  toggleAdd,
}: {
  id: string
  meaning: DictionaryMeaning
  withExamples: boolean
  added: string[]
  toggleAdd: (id: string) => void
}) {
  const isAdded = added.includes(id)
  return (
    <div className="rounded-xl bg-secondary p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-foreground">{meaning.meaning}</p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{meaning.definition}</p>
        </div>
        <button
          onClick={() => toggleAdd(id)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
            isAdded
              ? "bg-primary text-primary-foreground"
              : "bg-brand-purple/40 text-accent-foreground hover:bg-brand-purple/60",
          )}
        >
          {isAdded ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
          {isAdded ? "Added" : "Add"}
        </button>
      </div>
      {withExamples &&
        meaning.examples.map((example, index) => (
          <div key={index} className="mt-2 border-l-2 border-primary/30 pl-2.5 text-xs">
            <p className="leading-5 text-foreground">
              <span className="font-semibold text-primary">VD: </span>
              {example.en}
            </p>
            <p className="mt-0.5 italic leading-5 text-muted-foreground">{example.vi}</p>
          </div>
        ))}
    </div>
  )
}

function CheckboxRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-sm text-foreground"
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded border transition-colors",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card",
        )}
      >
        {checked && <Check className="size-3" />}
      </span>
      {label}
    </button>
  )
}

function EmptyState({ label }: { label: string }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{label}</p>
}
