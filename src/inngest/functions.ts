// src/inngest/functions.ts
import { inngest } from "./client";
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { firecrawl } from "../lib/firecrawl";
const URL_REGEX=/https?:\/\/[^\s/$.?#].[^\s]*/gi;
export const demoGenerate = inngest.createFunction(
  {
    id: "demo-generate",
    triggers: [{ event: "demo/generate" }],
  },
  async (ctx: any) => {
    const { event, step } = ctx;
    // In CLI invoke mode, payload can be provided as input instead of event.data.
    const prompt = event?.data?.prompt ?? ctx?.input?.prompt;
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Missing prompt. Send event data as { data: { prompt: string } } or invoke input as { prompt: string }.");
    }
    const urls=await step.run("extract-urls", async()=>{
      return prompt.match(URL_REGEX) ?? [];
    }) as string[];
    const scrapedContent = await step.run("scrape-urls", async () => {
      const results = await Promise.all(
        urls.map(async (url) => {
          const result = await firecrawl.scrape(url, { formats: ["markdown"] });
          return result?.markdown ?? null;
        })
      );
      return results.filter(Boolean).join("\n\n");
    });
    const finalPrompt = scrapedContent
      ? `Context:\n${scrapedContent}\n\nQuestion: ${prompt}`
      : prompt;

    return await step.run("generate-text", async () => {
      return await generateText({
        model: google("gemini-2.5-flash"),
        prompt: finalPrompt,
        experimental_telemetry:{
  isEnabled: true,
  recordInputs: true,
  recordOutputs: true,
},
      });
    });
  },
);