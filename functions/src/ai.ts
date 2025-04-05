import { onCall } from "firebase-functions/https";
import OpenAI from "openai";
import env from "./env";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { Chatroom } from "./models/chatroom";
import { Message } from "./models/message";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// Initialize Firebase Admin
initializeApp();

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: env.deepseekApiKey
});

const db = getFirestore();

export const talkWithTherapist = onCall(async (request) => {
    const { message, chatRoomId } = request.data;
    if (!message || typeof message !== 'string') {
        throw new Error('Prompt parameter is required and must be a string');
    }
    if (!chatRoomId) {
        throw new Error('ChatRoomId is required');
    }

    // Get chatroom data from Firestore
    const chatroomDoc = await db.collection('chatrooms').doc(chatRoomId).get();
    if (!chatroomDoc.exists) {
        throw new Error('Chatroom not found');
    }

    const chatroom: Chatroom = chatroomDoc.data() as Chatroom;

    if (!chatroom.messages) chatroom.messages = [];
    const { userContext, messages } = chatroom;
    chatroom.messages.push({
        id: crypto.randomUUID(),
        content: message,
        sender: 'user',
        timestamp: new Date()
    });

    const iaResponse: string | null = await generateText(userContext, messages);

    if (iaResponse) {
        messages.push({
            id: crypto.randomUUID(),
            content: iaResponse,
            sender: 'system',
            timestamp: new Date()
        });
    }

    await db.collection('chatrooms').doc(chatRoomId).update({
        updatedAt: new Date(),
        messages: chatroom.messages
    });

    return {
        iaResponse
    };
});

async function generateText(context: string, messagesList: Message[]): Promise<string | null> {
    const messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: `He acts as a psychologist using a variety of modalities, as he is an experienced CBT psychologist with a background in psychotherapy and an expert in helping people reframe their thoughts using CBT and logotherapy techniques. He speaks closely and directly.What do you think? What solutions can you give me?Before answering, do you have any questions for me? Answer in the same language in which the question is asked. Keep the answers short and concise.
            [Context]
            ${context}`
        },
        ...messagesList.map(message => ({
            role: message.sender === 'user' ? 'user' as const : 'system' as const,
            content: message.content
        }))
    ];

    try {
        const completion = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages,
            temperature: 0.7,
            max_tokens: 1000
        });

        return completion.choices[0]?.message?.content || null;
    } catch (error) {
        console.error('Error generating text:', error);
        return null;
    }
}