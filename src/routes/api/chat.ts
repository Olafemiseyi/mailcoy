import { createFileRoute } from "@tanstack/react-router";
import { streamText, convertToModelMessages } from "ai";
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

// Converts AI SDK v3/v4 UI messages OR v7 UI messages into CoreMessages for the LLM
function toCoreMessages(messages: any[]): any[] {
  return messages.map((m) => {
    if (m.role === "system") return { role: "system", content: m.content || m.parts?.[0]?.text || "" };
    
    // User message can only contain text or file parts
    if (m.role === "user") {
      return { role: "user", content: m.content || m.parts?.map((p: any) => p.text).join("") || "" };
    }
    
    // Assistant message contains text and tool calls
    if (m.role === "assistant") {
      const content: any[] = [];
      const text = m.content || m.parts?.find((p: any) => p.type === "text")?.text;
      if (text) content.push({ type: "text", text });

      const tools = m.toolInvocations || m.parts?.filter((p: any) => p.type === "tool-invocation").map((p: any) => ({
        toolCallId: p.toolInvocationId || p.toolCallId,
        toolName: p.toolName,
        args: p.args,
        result: p.result
      })) || [];

      tools.forEach((t: any) => {
        content.push({
          type: "tool-call",
          toolCallId: t.toolCallId,
          toolName: t.toolName,
          args: t.args,
        });
      });

      return { role: "assistant", content: content.length > 0 ? content : "" };
    }
    
    // Tool message (only in CoreMessage structure, usually AI SDK v3 maps toolInvocations to a separate tool message if following up)
    // Actually, in CoreMessage, tool results are returned as a "tool" role message
    if (m.role === "tool") return m;
    
    return { role: "user", content: "" }; // fallback
  }).reduce((acc: any[], m, i, arr) => {
    // If the assistant message had tool calls, we MUST append a "tool" message with the results
    acc.push(m);
    if (m.role === "assistant" && Array.isArray(m.content)) {
      const toolCalls = m.content.filter((c: any) => c.type === "tool-call");
      if (toolCalls.length > 0) {
        // Find the original message to get the results
        const originalMsg = messages[i];
        const tools = originalMsg.toolInvocations || originalMsg.parts?.filter((p: any) => p.type === "tool-invocation" || p.type === "tool-result") || [];
        
        const toolContent = toolCalls.map((tc: any) => {
          const t = tools.find((t: any) => (t.toolCallId || t.toolInvocationId) === tc.toolCallId);
          return {
            type: "tool-result",
            toolCallId: tc.toolCallId,
            toolName: tc.toolName,
            result: t?.result,
          };
        }).filter((tc: any) => tc.result !== undefined);

        if (toolContent.length > 0) {
          acc.push({ role: "tool", content: toolContent });
        }
      }
    }
    return acc;
  }, []);
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: any) => {
        try {
          const { messages, organizationId } = await request.json();

          if (!organizationId) {
            console.warn("API Chat: organizationId is missing in request body, but continuing...");
          }

          const result = streamText({
            model: groq("llama-3.3-70b-versatile"),
            system: `You are Mailcoy AI, a helpful, conversational assistant built directly into the Mailcoy dashboard. Your job is to instruct, guide, and help users understand how to manage their email infrastructure.

Rules:
1. You DO NOT have access to tools. You cannot add domains, retrieve analytics, or change settings yourself.
2. If a user asks you to perform an action (e.g., "add a domain", "change my settings"), politely explain that you cannot perform the action for them, but you can guide them on how to do it in the dashboard.
3. Keep your tone highly professional, crisp, and helpful. Use markdown to format instructions clearly.
4. Do not mention that you used to have tools or that you were downgraded. Just act as a helpful guide.`,
            messages: toCoreMessages(messages),
          });

          return result.toUIMessageStreamResponse();
        } catch (e: unknown) {
          console.error(e);
          return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
        }
      },
    },
  },
});
