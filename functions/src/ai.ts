import { onCall } from "firebase-functions/https";
import OpenAI from "openai";
import env from "./env";

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: env.deepseekApiKey
});

export const talkWithTherapist = onCall(async (request) => {
    const { prompt } = request.data;
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt parameter is required and must be a string');
    }
    const iaResponse: string | null = await generateText(prompt);
    // logger.info("Hello logs!", { structuredData: true });
    return {
        iaResponse
    };
});

const generateText = async (prompt: string): Promise<string | null> => {
    const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "system", content: prompt }],
    });

    return response.choices[0].message.content;
};