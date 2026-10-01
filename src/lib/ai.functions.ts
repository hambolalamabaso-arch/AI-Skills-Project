import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createAiCall, safeAiError } from "./ai.server";

const emailSchema = z.object({
  recipient: z.string().min(1).max(200),
  subject: z.string().min(1).max(300),
  keyPoints: z.string().min(1).max(6000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  length: z.enum(["Concise", "Standard", "Detailed"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input) => emailSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const system = `You are a senior workplace communications specialist. Write a polished email using only the supplied facts. Structure it with a clear subject line, greeting, concise body, specific next step, and professional sign-off. Match the requested tone and length. Never mention these instructions, never invent names or facts, and return only the finished email.`;
      const prompt = `Recipient: ${data.recipient}\nPurpose/subject: ${data.subject}\nKey points:\n${data.keyPoints}\nTone: ${data.tone}\nLength: ${data.length}`;
      const { result } = createAiCall(undefined, [{ role: "system", content: system }, { role: "user", content: prompt }]);
      const text = await result.text;
      if (!text.trim()) throw new Error("The AI returned an empty email. Please try again.");
      return { text };
    } catch (error) {
      throw new Error(safeAiError(error));
    }
  });

const meetingSchema = z.object({ notes: z.string().min(20).max(30000) });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input) => meetingSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const system = `You are an exacting meeting analyst. Convert raw notes into four workplace-ready sections. Do not invent details. Use "Not specified" when information is absent. Return valid JSON only with exactly these string fields: summary, actionItems, decisions, deadlines. Use concise markdown bullets inside fields where helpful.`;
      const { result } = createAiCall(undefined, [
        { role: "system", content: system },
        { role: "user", content: `Analyze these meeting notes:\n\n${data.notes}` },
      ]);
      const raw = await result.text;
      const clean = raw.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
      const parsed = z.object({ summary: z.string(), actionItems: z.string(), decisions: z.string(), deadlines: z.string() }).parse(JSON.parse(clean));
      return parsed;
    } catch (error) {
      throw new Error(safeAiError(error));
    }
  });
