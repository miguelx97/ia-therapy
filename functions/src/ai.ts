import { onCall } from "firebase-functions/https";
import OpenAI from "openai";
import env from "./env";

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: env.deepseekApiKey
});

export const helloWorld = onCall(async (request) => {
    const msg = await generateText("hola");
    // logger.info("Hello logs!", { structuredData: true });
    return {
        data: {
            msg
        }
    };
});

const generateText = async (prompt: string): Promise<string | null> => {
    const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "system", content: prompt }],
    });

    return response.choices[0].message.content;
};