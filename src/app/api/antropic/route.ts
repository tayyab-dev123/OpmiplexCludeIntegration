// import { NextRequest, NextResponse } from "next/server";
// import Anthropic from "@anthropic-ai/sdk";

// const client = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

// export const runtime = "edge";

// export async function POST(req: Request) {
//   try {
//     const { messages, model, max_tokens, temperature, top_p } =
//       await req.json();
//     console.log("messages", messages);
//     let system = null;

//     // Find the index of the 'system' role object
//     let systemIndex = messages.findIndex(
//       (message) => message.role === "system"
//     );

//     if (systemIndex !== -1) {
//       // Save the content of the 'system' role object
//       system = messages[systemIndex].content;

//       // Remove the 'system' role object from the array
//       messages.splice(systemIndex, 1);
//     }
//     console.log("messagesAfter", messages);

//     const response = await client.messages.create({
//       model: model || "claude-3-haiku-20240307",
//       max_tokens: max_tokens || 1024,
//       messages: messages,
//       temperature,
//       top_p,
//       system,
//     });

//     const data: string = await response?.content[0]?.text;

//     return new NextResponse(JSON.stringify(data), {
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ error: error }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, model, max_tokens, temperature, top_p } =
      await req.json();

    console.log("Received request:", {
      messages,
      model,
      max_tokens,
      temperature,
      top_p,
    });

    const systemIndex = messages.findIndex(
      (message) => message.role === "system"
    );
    if (systemIndex !== -1) {
      // Remove the 'system' role object from the array
      messages.splice(systemIndex, 1);
    }

    const stream = await client.messages.create({
      model: model || "claude-3-opus-20240229",
      max_tokens: max_tokens || 1024,
      messages: messages || [
        { role: "user", content: "i want to learn python in 20 words" },
      ],
      temperature: temperature || 0.7,
      top_p: top_p || 1.0,
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const messageStreamEvent of stream) {
            if (
              messageStreamEvent.type === "content_block_delta" &&
              messageStreamEvent.delta?.text
            ) {
              console.log("Streaming content:", messageStreamEvent.delta.text);
              controller.enqueue(
                new TextEncoder().encode(messageStreamEvent.delta.text)
              );
            }
          }
          controller.close();
        } catch (error) {
          console.error("Error during streaming:", error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error during generation:", error);
    return new NextResponse(
      JSON.stringify({ error: "An error occurred during generation." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
