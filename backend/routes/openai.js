const { OpenAI } = require("openai");
const { Router } = require("express");

const router = Router();
const prisma = require("../services/prisma");
// {
//   id: 'resp_0a098150ef2f9901006912722ad48c819798736e60059fec5d',
//   object: 'response',
//   created_at: 1762816554,
//   status: 'completed',
//   background: false,
//   billing: { payer: 'developer' },
//   error: null,
//   incomplete_details: null,
//   instructions: null,
//   max_output_tokens: null,
//   max_tool_calls: null,
//   model: 'gpt-3.5-turbo-0125',
//   output: [
//     {
//       id: 'msg_0a098150ef2f9901006912722b24e4819795b15b31a47fee3d',
//       type: 'message',
//       status: 'completed',
//       content: [Array],
//       role: 'assistant'
//     }
//   ],
//   parallel_tool_calls: true,
//   previous_response_id: null,
//   prompt_cache_key: null,
//   prompt_cache_retention: null,
//   reasoning: { effort: null, summary: null },
//   safety_identifier: null,
//   service_tier: 'default',
//   store: true,
//   temperature: 1,
//   text: { format: { type: 'text' }, verbosity: 'medium' },
//   tool_choice: 'auto',
//   tools: [],
//   top_logprobs: 0,
//   top_p: 1,
//   truncation: 'disabled',
//   usage: {
//     input_tokens: 12,
//     input_tokens_details: { cached_tokens: 0 },
//     output_tokens: 35,
//     output_tokens_details: { reasoning_tokens: 0 },
//     total_tokens: 47
//   },
//   user: null,
//   metadata: {},
//   output_text: "Hello! I'm just a language model AI, so I don't have feelings, but I'm here and ready to assist you. How can I help you today?"
// }
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

router.patch("/update", async (req, res, next) => {});

router.get("/get", async (req, res, next) => {
  const data = await client.responses.create({
    model: "gpt-3.5-turbo",
    input: "Write a one-sentence bedtime story about a unicorn.",
  });
  res.send({
    output: data,
  });
});

router.post("/create", async (req, res, next) => {
  try {
    // console.log(req.body, "body");
    // const data = await client.responses.create({
    //   model: "gpt-3.5-turbo",
    //   input: req.body,
    // });
    // console.log(data, "data");
    return res.json({
      response: { data: "data", output_text: "data?.output_text" },
    });
  } catch (error) {
    return next(error);
  }
});
router.delete("/delete", async (req, res, next) => {});

module.exports = router;
