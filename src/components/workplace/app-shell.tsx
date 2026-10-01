import { Link, useRouterState } from "@tanstack/react-router";
import { Bot, FileText, LayoutDashboard, Mail, Menu, Plus, X } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Thread = { id: string; title: string };
type ThreadsContextValue = {
  threads: Thread[];
  createThread: () => Thread;
  renameThread: (id: string, title: string) => void;
};
const ThreadsContext = createContext<ThreadsContextValue | null>(null);

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `thread-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useThreads() {
  const value = useContext(ThreadsContext);
  if (!value) throw new Error("useThreads must be used inside AppShell");
  return value;
}

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Email Generator", to: "/email", icon: Mail },
  { label: "Meeting Summarizer", to: "/meetings", icon: FileText },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Bot className="size-5" />
      </span>
      <div>
        <p className="text-sm font-semibold leading-tight">AI Workplace</p>
        <p className="text-xs text-muted-foreground">Productivity Assistant</p>
      </div>
    </div>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { threads, createThread } = useThreads();
  return (
    <div className="flex h-full flex-col bg-sidebar p-4 text-sidebar-foreground">
      <Brand />
      <nav className="mt-9 space-y-1" aria-label="Main navigation">
        {navItems.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              path === to
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
        <div className="pt-4">
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-xs font-semibold uppercase text-muted-foreground">AI Chat</span>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="New chat"
              onClick={() => {
                const thread = createThread();
                window.location.assign(`/chat/${thread.id}`);
              }}
            >
              <Plus />
            </Button>
          </div>
          <div className="space-y-1">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                to="/chat/$threadId"
                params={{ threadId: thread.id }}
                onClick={onNavigate}
                className={cn(
                  "block truncate rounded-md px-3 py-2 text-sm transition-colors",
                  path === `/chat/${thread.id}`
                    ? "bg-sidebar-accent font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                )}
              >
                {thread.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <div className="mt-auto border-t border-sidebar-border pt-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your ideas, refined by AI. Always review before use.
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  useEffect(() => {
    const stored = sessionStorage.getItem("workplace-threads");
    if (stored) {
      try {
        setThreads(JSON.parse(stored) as Thread[]);
        return;
      } catch {
        sessionStorage.removeItem("workplace-threads");
      }
    }
    const initial = [{ id: newId(), title: "New conversation" }];
    sessionStorage.setItem("workplace-threads", JSON.stringify(initial));
    setThreads(initial);
  }, []);
  const value = useMemo<ThreadsContextValue>(
    () => ({
      threads,
      createThread: () => {
        const thread = { id: newId(), title: "New conversation" };
        setThreads((current) => {
          const next = [thread, ...current];
          sessionStorage.setItem("workplace-threads", JSON.stringify(next));
          return next;
        });
        return thread;
      },
      renameThread: (id, title) =>
        setThreads((current) => {
          const next = current.map((t) => (t.id === id ? { ...t, title } : t));
          sessionStorage.setItem("workplace-threads", JSON.stringify(next));
          return next;
        }),
    }),
    [threads],
  );
  return (
    <ThreadsContext.Provider value={value}>
      <div className="min-h-screen bg-background text-foreground">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border lg:block">
          <Sidebar />
        </aside>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              className="absolute inset-0 bg-overlay"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative h-full w-[82vw] max-w-72 border-r border-sidebar-border shadow-xl">
              <Button
                className="absolute right-3 top-3"
                size="icon-sm"
                variant="ghost"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X />
              </Button>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}
        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 flex h-18 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur md:px-8">
            <Button
              className="lg:hidden"
              size="icon"
              variant="ghost"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </Button>
            <div>
              <h1 className="text-base font-semibold md:text-lg">{title}</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">{subtitle}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              <span className="text-xs font-medium text-muted-foreground">AI ready</span>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1500px] p-4 md:p-8">{children}</main>
          <footer className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground md:px-8">
            AI Workplace Productivity Assistant · Built to support better work, not replace your
            judgment.
          </footer>
        </div>
      </div>
    </ThreadsContext.Provider>
  );
}
