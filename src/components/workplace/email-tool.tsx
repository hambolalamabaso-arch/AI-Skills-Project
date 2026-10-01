import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Mail, RefreshCw, Wand2 } from "lucide-react";
import { AppShell } from "./app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { generateEmail } from "@/lib/ai.functions";

export function EmailTool() {
  const call = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Standard");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  async function generate() {
    if (!recipient.trim() || !subject.trim() || !keyPoints.trim()) {
      setError("Complete the recipient, purpose, and key points first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await call({
        data: {
          recipient,
          subject,
          keyPoints,
          tone: tone as "Formal" | "Friendly" | "Persuasive",
          length: length as "Concise" | "Standard" | "Detailed",
        },
      });
      setOutput(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The email could not be generated.");
    } finally {
      setLoading(false);
    }
  }
  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  return (
    <AppShell
      title="Smart Email Generator"
      subtitle="Create clear, professional messages from a few key points."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
              <Mail />
            </span>
            <div>
              <h2 className="font-semibold">Email brief</h2>
              <p className="text-sm text-muted-foreground">
                Provide the essentials. AI handles the structure.
              </p>
            </div>
          </div>
          <div className="space-y-5">
            <label className="grid gap-2 text-sm font-medium">
              Recipient
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Project stakeholders"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Subject or purpose
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Confirm revised launch timeline"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Key points
              <Textarea
                className="min-h-36 resize-y"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Add the facts, context, and desired next step…"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Tone
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Length
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Concise">Concise</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>
            {error && (
              <p className="rounded-md bg-destructive-soft p-3 text-sm text-destructive">{error}</p>
            )}
            <Button className="w-full sm:w-auto" onClick={generate} disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" /> : <Wand2 />}
              {loading ? "Writing email…" : "Generate email"}
            </Button>
          </div>
        </section>
        <section className="flex min-h-[560px] flex-col rounded-lg border border-border bg-card p-5 shadow-sm md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">Draft</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Edit the result directly before you use it.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!output || loading} onClick={copy}>
                {copied ? <Check /> : <Copy />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="outline" size="sm" disabled={!output || loading} onClick={generate}>
                <RefreshCw />
                Regenerate
              </Button>
            </div>
          </div>
          <div className="mt-5 flex flex-1">
            {loading ? (
              <div className="grid flex-1 place-items-center rounded-md border border-dashed border-border bg-muted/40">
                <Shimmer>Composing a professional draft…</Shimmer>
              </div>
            ) : output ? (
              <Textarea
                className="min-h-96 flex-1 resize-none leading-relaxed"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                aria-label="Generated email"
              />
            ) : (
              <div className="grid flex-1 place-items-center rounded-md border border-dashed border-border bg-muted/40 px-8 text-center">
                <div>
                  <Mail className="mx-auto size-7 text-muted-foreground" />
                  <p className="mt-4 text-sm font-medium">Your email will appear here</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete the brief and generate a draft.
                  </p>
                </div>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            AI-generated content may be inaccurate - always review before use.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
