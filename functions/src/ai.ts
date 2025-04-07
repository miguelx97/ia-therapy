import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import OpenAI from "openai";
import { error } from "firebase-functions/logger";
import env from "./env";

export class AI {
    private static _openai: OpenAI;

    static get openai() {
        if (!AI._openai) {
            AI._openai = new OpenAI({
                baseURL: 'https://api.deepseek.com',
                apiKey: env.deepseekApiKey
            });
        }
        return AI._openai;
    }

    static conversation = async (messages: ChatCompletionMessageParam[], maxTokens: number = 200): Promise<string | null> => {
        try {
            const completion = await AI.openai.chat.completions.create({
                model: "deepseek-chat",
                messages,
                temperature: 1,
                max_completion_tokens: maxTokens
            });

            return completion.choices[0]?.message?.content || null;
        } catch (ex) {
            error(ex);
            return null;
        }
    }

    static reply = async (prompt: string, maxTokens?: number): Promise<string | null> => {
        const messages: ChatCompletionMessageParam[] = [
            { role: "user", content: prompt }
        ];
        const response = await AI.conversation(messages, maxTokens);
        return response;
    }
}