import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Clock3, FileText, Mail, ShieldCheck } from "lucide-react";
import { AppShell } from "./app-shell";

const tools = [
  { title: "Smart Email Generator", description: "Turn key points into a clear, polished email in seconds.", to: "/email", icon: Mail, action: "Draft an email" },
  { title: "Meeting Notes Summarizer", description: "Extract decisions, actions, deadlines, and a concise summary.", to: "/meetings", icon: FileText, action: "Summarize notes" },
  { title: "AI Workplace Chat", description: "Think through priorities, plans, and communication with context.", to: "/chat/$threadId", icon: Bot, action: "Start a conversation", chat: true },
] as const;

export function Dashboard() {
  let threadId: string | undefined;
  if (typeof window !== "undefined") {
    try { threadId = (JSON.parse(sessionStorage.getItem("workplace-threads") || "[]") as { id: string }[])[0]?.id; } catch { threadId = undefined; }
  }
  return <AppShell title="Dashboard" subtitle="Everything you need for a more productive workday."><section className="mb-8 max-w-3xl"><p className="mb-2 text-sm font-medium text-primary">Thursday, October 1</p><h2 className="text-3xl font-semibold tracking-normal md:text-4xl">Good afternoon. What will you accomplish today?</h2><p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">Move from rough thinking to ready-to-use work with focused AI tools for communication, meetings, and planning.</p></section>
  <section className="grid gap-4 md:grid-cols-3">{tools.map(({ title, description, to, icon: Icon, action, chat }) => <article key={title} className="group flex min-h-64 flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"><div className="grid size-11 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-5" /></div><h3 className="mt-7 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p><Link className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-primary" {...(chat ? { to, params: { threadId: threadId || "new" } } : { to })}>{action}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link></article>)}</section>
  <section className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_.7fr]"><div className="rounded-lg border border-border bg-contrast p-6 text-contrast-foreground md:p-8"><div className="flex items-center gap-3"><ShieldCheck className="size-5 text-contrast-muted" /><p className="text-sm font-semibold">Responsible AI, built into every workflow</p></div><p className="mt-3 max-w-2xl text-sm leading-relaxed text-contrast-muted">AI-generated content may be inaccurate - always review before use.</p></div><div className="rounded-lg border border-border bg-card p-6"><div className="flex items-center gap-3"><Clock3 className="size-5 text-primary" /><p className="text-sm font-semibold">Designed for focus</p></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Your chats remain available for this browser session and clear when the session ends.</p></div></section></AppShell>;
}
