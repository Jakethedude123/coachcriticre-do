import Anthropic from '@anthropic-ai/sdk';

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    stream: true,
    messages: messages.map((m: any) => ({
      content: m.content,
      role: m.role === 'user' ? 'user' : 'assistant',
    })),
    max_tokens: 1024,
  });

  // Convert the response into a friendly text-stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of response) {
          // Type assertion to handle the chunk structure
          const event = chunk as { type: string; delta: { text?: string } };
          if (event.type === 'content_block_delta' && event.delta.text) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error) {
        console.error('Streaming error:', error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
