"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Award,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  LockKeyhole,
  Mail,
  Pencil,
  Settings2,
  ShieldCheck,
  Target,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activity = [
  { day: "Mon", date: 10, minutes: 24 },
  { day: "Tue", date: 11, minutes: 42 },
  { day: "Wed", date: 12, minutes: 18 },
  { day: "Thu", date: 13, minutes: 56 },
  { day: "Fri", date: 14, minutes: 31 },
  { day: "Sat", date: 15, minutes: 12 },
  { day: "Sun", date: 16, minutes: 38 },
]

const history = [
  { title: "TOEIC Part 5 · Grammar focus", type: "Practice test", score: "86%", date: "Today, 10:42 AM", icon: BookOpen },
  { title: "Business vocabulary · Contracts", type: "Vocabulary review", score: "24 words", date: "Yesterday, 6:18 PM", icon: Zap },
  { title: "Present perfect vs. past simple", type: "Grammar lesson", score: "Complete", date: "Jun 14, 8:05 PM", icon: Target },
  { title: "TOEIC Reading mini test", type: "Practice test", score: "78%", date: "Jun 12, 7:24 AM", icon: Trophy },
]

const badges = [
  { name: "First steps", detail: "Complete your first lesson", earned: true, icon: Award },
  { name: "Seven day spark", detail: "Keep a 7-day streak", earned: true, icon: Flame },
  { name: "Word collector", detail: "Learn 100 new words", earned: true, icon: BookOpen },
  { name: "Perfect focus", detail: "Score 100% on a test", earned: false, icon: ShieldCheck },
]

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "account" | "settings">("overview")
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [displayName, setDisplayName] = useState("Phung Sy")
  const [dailyGoal, setDailyGoal] = useState("30")
  const [notifications, setNotifications] = useState(true)

  function saveProfile() {
    setEditing(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2400)
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 pb-8 pt-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground shadow-sm md:p-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <Image src="/avatars/user.png" alt="Phung Sy profile" width={96} height={96} className="size-20 rounded-[1.5rem] object-cover ring-4 ring-primary-foreground/20 md:size-24" />
              <span className="absolute -bottom-2 -right-2 flex size-7 items-center justify-center rounded-full bg-brand-orange text-foreground ring-4 ring-primary"><Check className="size-4" strokeWidth={3} /></span>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-primary-foreground/70">Your learning space</p>
              <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">{displayName}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/75"><Mail className="size-4" /> phungsy266@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-primary-foreground/10 p-4 md:min-w-56">
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand-orange text-foreground"><Flame className="size-5" /></div>
            <div><p className="text-2xl font-bold">7 days</p><p className="text-xs text-primary-foreground/70">Current streak</p></div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border-[32px] border-primary-foreground/5" />
      </section>

      <nav className="flex gap-2 overflow-x-auto rounded-2xl bg-card p-2 ring-1 ring-foreground/10" aria-label="Profile sections">
        {([['overview', 'Overview', UserRound], ['account', 'Account information', ShieldCheck], ['settings', 'Settings', Settings2]] as const).map(([id, label, Icon]) => (
          <button key={id} type="button" onClick={() => setActiveTab(id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${activeTab === id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"}`}><Icon className="size-4" />{label}</button>
        ))}
      </nav>

      {activeTab === "overview" && <>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Level 12', 'Explorer level', Zap, 'text-brand-orange'], ['1,840', 'Total XP', Trophy, 'text-primary'], ['68%', 'Average score', Target, 'text-brand-pink'], ['24h 18m', 'Study time', Clock3, 'text-brand-purple']].map(([value, label, Icon, tone]) => <Card key={label as string} size="sm"><CardContent className="flex items-center gap-3 pt-4"><div className={`flex size-10 items-center justify-center rounded-xl bg-secondary ${tone}`}><Icon className="size-5" /></div><div><p className="text-xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></CardContent></Card>)}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <Card><CardHeader className="flex flex-row items-start justify-between"><div><CardTitle>Learning activity</CardTitle><p className="mt-1 text-sm text-muted-foreground">Your practice rhythm this week</p></div><Badge variant="secondary">+12% this week</Badge></CardHeader><CardContent><div className="flex items-end justify-between gap-2 pt-5">{activity.map((item) => <div key={item.day} className="flex flex-1 flex-col items-center gap-2"><div className="flex h-36 w-full items-end rounded-xl bg-secondary/70 p-1"><div className="w-full rounded-lg bg-primary transition-all" style={{ height: `${Math.max(18, item.minutes / 60 * 100)}%` }} /></div><span className="text-xs text-muted-foreground">{item.day}</span><span className="text-xs font-semibold">{item.date}</span></div>)}</div></CardContent></Card>
          <Card><CardHeader><CardTitle>Streak momentum</CardTitle><p className="mt-1 text-sm text-muted-foreground">Small sessions add up</p></CardHeader><CardContent className="flex flex-col gap-5"><div className="flex items-center gap-4 rounded-2xl bg-brand-orange/15 p-4"><div className="flex size-14 items-center justify-center rounded-2xl bg-brand-orange text-foreground"><Flame className="size-7" /></div><div><p className="text-3xl font-bold">7</p><p className="text-sm text-muted-foreground">days in a row</p></div><div className="ml-auto text-right"><p className="text-sm font-bold">Best: 14</p><p className="text-xs text-muted-foreground">personal record</p></div></div><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Weekly goal</span><span className="font-semibold">4 / 5 sessions</span></div><div className="h-2 rounded-full bg-secondary"><div className="h-2 w-4/5 rounded-full bg-primary" /></div><p className="text-xs text-muted-foreground">One more session to complete your weekly goal.</p></CardContent></Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Recent learning history</CardTitle><p className="mt-1 text-sm text-muted-foreground">Your latest practice sessions</p></div><button type="button" onClick={() => setActiveTab("account")} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">View all <ChevronRight className="size-4" /></button></CardHeader><CardContent className="flex flex-col gap-2">{history.slice(0, 3).map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary/70"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.type} · {item.date}</p></div><span className="text-sm font-bold text-primary">{item.score}</span></div> })}</CardContent></Card>
          <Card><CardHeader><CardTitle>Recent badges</CardTitle><p className="mt-1 text-sm text-muted-foreground">Keep building your collection</p></CardHeader><CardContent className="grid grid-cols-2 gap-3">{badges.map((badge) => { const Icon = badge.icon; return <div key={badge.name} className={`rounded-2xl border p-3 ${badge.earned ? "bg-secondary/50" : "opacity-50"}`}><div className="mb-3 flex items-center justify-between"><div className="flex size-9 items-center justify-center rounded-xl bg-brand-orange/20 text-brand-orange"><Icon className="size-4" /></div>{badge.earned ? <Check className="size-4 text-primary" /> : <LockKeyhole className="size-4 text-muted-foreground" />}</div><p className="text-xs font-bold">{badge.name}</p><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{badge.detail}</p></div> })}</CardContent></Card>
        </section>
      </>}

      {activeTab === "account" && <section className="grid gap-6 lg:grid-cols-[1fr_1.25fr]"><Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Account information</CardTitle><p className="mt-1 text-sm text-muted-foreground">Keep your learning identity up to date.</p></div><Button variant="outline" size="sm" onClick={() => editing ? saveProfile() : setEditing(true)}>{saved ? <Check className="mr-2 size-4" /> : <Pencil className="mr-2 size-4" />}{saved ? "Saved" : editing ? "Save changes" : "Edit profile"}</Button></CardHeader><CardContent className="flex flex-col gap-5">{editing ? <label className="flex flex-col gap-2 text-sm font-semibold">Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="h-11 rounded-xl border bg-background px-3 font-normal outline-none ring-primary focus:ring-2" /></label> : <div className="flex items-center gap-4 rounded-2xl bg-secondary/60 p-4"><Image src="/avatars/user.png" alt="Profile avatar" width={64} height={64} className="size-16 rounded-2xl object-cover" /><div><p className="font-bold">{displayName}</p><p className="mt-1 text-sm text-muted-foreground">Member since June 2024</p></div></div>}<div className="grid gap-4 sm:grid-cols-2"><div><p className="text-xs text-muted-foreground">Email address</p><p className="mt-1 text-sm font-semibold">phungsy266@gmail.com</p></div><div><p className="text-xs text-muted-foreground">Account role</p><p className="mt-1 text-sm font-semibold">Learner</p></div></div></CardContent></Card><Card><CardHeader><CardTitle>Learning history</CardTitle><p className="mt-1 text-sm text-muted-foreground">A record of your recent progress.</p></CardHeader><CardContent className="flex flex-col gap-2">{history.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-3 rounded-xl border p-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.type} · {item.date}</p></div><Badge variant="secondary">{item.score}</Badge></div> })}</CardContent></Card></section>}

      {activeTab === "settings" && <section className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle>Study preferences</CardTitle><p className="mt-1 text-sm text-muted-foreground">Shape the learning rhythm around your day.</p></CardHeader><CardContent className="flex flex-col gap-5"><label className="flex items-center justify-between gap-4"><span><span className="block text-sm font-semibold">Daily study goal</span><span className="text-xs text-muted-foreground">Minutes you want to practice each day</span></span><select value={dailyGoal} onChange={(event) => setDailyGoal(event.target.value)} className="h-10 rounded-xl border bg-background px-3 text-sm font-semibold"><option value="20">20 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option></select></label><div className="flex items-center justify-between gap-4"><span><span className="block text-sm font-semibold">Daily reminders</span><span className="text-xs text-muted-foreground">Get a nudge when it is time to learn</span></span><button type="button" aria-pressed={notifications} onClick={() => setNotifications(!notifications)} className={`relative h-6 w-11 rounded-full transition-colors ${notifications ? "bg-primary" : "bg-secondary"}`}><span className={`absolute top-1 size-4 rounded-full bg-card transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`} /></button></div></CardContent></Card><Card><CardHeader><CardTitle>Privacy & security</CardTitle><p className="mt-1 text-sm text-muted-foreground">Your account, your control.</p></CardHeader><CardContent className="flex flex-col gap-2"><button type="button" className="flex items-center gap-3 rounded-xl p-3 text-left hover:bg-secondary"><LockKeyhole className="size-5 text-primary" /><span className="flex-1"><span className="block text-sm font-semibold">Change password</span><span className="text-xs text-muted-foreground">Update your account password</span></span><ChevronRight className="size-4 text-muted-foreground" /></button><button type="button" className="flex items-center gap-3 rounded-xl p-3 text-left hover:bg-secondary"><Bell className="size-5 text-primary" /><span className="flex-1"><span className="block text-sm font-semibold">Notification center</span><span className="text-xs text-muted-foreground">Manage email and practice alerts</span></span><ChevronRight className="size-4 text-muted-foreground" /></button></CardContent></Card></section>}
    </div>
  )
}
