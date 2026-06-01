import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google1 = createGoogleGenerativeAI({
  apiKey: "GOOGLE_GENERATIVE_AI_API_KEY",
});


export async function POST(){
const response = await generateText({
model: google1('gemini-2.5-flash'),
prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
return Response.json({response});
};