import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const {
    messages,
    model,
    temperature,
    max_tokens,
    top_p,
    frequency_penalty,
    presence_penalty,
  } = await req.json();

  const response = await openai.chat.completions.create({
    stream: true,
    model: model,
    temperature: temperature,
    max_tokens: max_tokens,
    top_p: top_p,
    frequency_penalty: frequency_penalty,
    presence_penalty: presence_penalty,
    messages: messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

// import Anthropic from "@anthropic-ai/sdk";
// import OpenAI from "openai";
// import { OpenAIStream, StreamingTextResponse } from "ai";

// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const runtime = "edge";

// export async function POST(req: Request) {
//   const {
//     messages,
//     model,
//     temperature,
//     max_tokens,
//     top_p,
//     frequency_penalty,
//     presence_penalty,
//     provider,
//   } = await req.json();

//   let response;
//   if (provider === "anthropic") {
//     response = await anthropic.messages.create({
//       stream: true,
//       model: model,
//       temperature: temperature,
//       max_tokens: max_tokens,
//       top_p: top_p,
//       frequency_penalty: frequency_penalty,
//       presence_penalty: presence_penalty,
//       messages: messages,
//     });
//   } else if (provider === "openai") {
//     response = await openai.chat.completions.create({
//       stream: true,
//       model: model,
//       temperature: temperature,
//       max_tokens: max_tokens,
//       top_p: top_p,
//       frequency_penalty: frequency_penalty,
//       presence_penalty: presence_penalty,
//       messages: messages,
//     });
//   } else {
//     return new Response("Invalid provider", { status: 400 });
//   }

//   const stream = OpenAIStream(response);
//   return new StreamingTextResponse(stream);
// }
