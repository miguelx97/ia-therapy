import { onCall } from "firebase-functions/https";
import { log } from "firebase-functions/logger";
import { DocumentReference, DocumentSnapshot, getFirestore } from "firebase-admin/firestore";
import { Chatroom } from "./models/chatroom";
import { Message } from "./models/message";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { AI } from "./ai";
import { UserInfo } from "./models/userInfo";
import { loadPrompts } from "./promts";
import { Prompts } from "./models/prompts";
// Initialize Firebase Admin

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
    const { userContext, messages, summary } = chatroom;
    chatroom.messages.push({
        id: crypto.randomUUID(),
        content: message,
        sender: 'user',
        timestamp: new Date()
    });

    const { therapist } = await loadPrompts(userContext, summary);

    const iaResponse: string | null = await generateTherapistMessage(therapist.full, messages);

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

async function generateTherapistMessage(context: string, messagesList: Message[]): Promise<string | null> {
    const messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: context
        },
        ...messagesList.map(message => ({
            role: message.sender === 'user' ? 'user' as const : 'system' as const,
            content: message.content
        }))
    ];

    return AI.conversation(messages);
}

export const createUpdateChatRoom = onCall(async (request) => {

    const chatroom: Chatroom = request.data.chatroom;

    // get user info by auth
    const user = request.auth;
    if (!user) {
        throw new Error('User not found');
    }

    const { chatroomTitle } = await loadPrompts(chatroom.userContext, chatroom.summary);
    if (chatroom.userContext) {
        const iaDescription: string | null = await AI.reply(chatroomTitle, 100);
        chatroom.description = iaDescription ?? 'Your AI therapist';
    } else {
        chatroom.description = 'Your AI therapist';
    }
    chatroom.userId = user.uid;
    chatroom.messages = [];

    log("!!!chatroom:", chatroom);

    const { welcome, therapist } = await loadPrompts(chatroom.userContext, chatroom.summary);
    const messages: Message[] = [
        {
            id: '1',
            content: welcome,
            sender: 'system',
            timestamp: new Date()
        }
    ];
    const aiTherapistWellcome: string | null = await generateTherapistMessage(therapist.short, messages);
    if (aiTherapistWellcome) {
        chatroom.messages.push({
            id: crypto.randomUUID(),
            content: aiTherapistWellcome,
            sender: 'system',
            timestamp: new Date()
        });
    }

    let chatroomDoc: DocumentSnapshot | DocumentReference;
    if (chatroom.id) {
        chatroomDoc = await db.collection('chatrooms').doc(chatroom.id).get();
        if (chatroomDoc.exists) {
            await db.collection('chatrooms').doc(chatroom.id).set(chatroom);
        } else {
            throw new Error('Chatroom not found');
        }
    } else {
        delete chatroom.id;
        chatroomDoc = await db.collection('chatrooms').add(chatroom);
    }

    const userInfoDoc = await db.collection('users').doc(user.uid).get();
    let userInfo: UserInfo;
    if (userInfoDoc.exists) {
        userInfo = userInfoDoc.data() as UserInfo;
    } else {
        userInfo = {
            id: user.uid,
            chatrooms: [],
            selectedChatRoom: ''
        };
    }


    if (!userInfo.chatrooms) userInfo.chatrooms = [];

    // Check if chatroom already exists in userInfo.chatrooms
    const chatRoomInfo = {
        id: chatroomDoc.id,
        description: chatroom.description,
        updatedAt: new Date(),
        createdAt: chatroom.createdAt,
        userContext: chatroom.userContext,
        summary: ''
    }
    const existingChatroomIndex = userInfo.chatrooms.findIndex(cr => cr.id === chatRoomInfo.id);

    if (existingChatroomIndex !== -1) {
        // Update existing chatroom
        userInfo.chatrooms[existingChatroomIndex] = chatRoomInfo;
    } else {
        // Add new chatroom to the array
        userInfo.chatrooms.push(chatRoomInfo);
    }

    userInfo.selectedChatRoom = chatRoomInfo.id;

    await db.collection('users').doc(user.uid).set(userInfo);

    return {
        success: true
    }
});

export const therapySummary = onCall(async (request) => {
    const { chatRoomId } = request.data;
    if (!chatRoomId) {
        throw new Error('ChatRoomId is required');
    }

    const chatroomDoc = await db.collection('chatrooms').doc(chatRoomId).get();
    if (!chatroomDoc.exists) {
        throw new Error('Chatroom not found');
    }

    const chatroom: Chatroom = chatroomDoc.data() as Chatroom;
    let prompts: Prompts = await loadPrompts(chatroom.userContext, chatroom.summary);

    let messages: Message[] = chatroom.messages;
    messages.push({
        id: crypto.randomUUID(),
        content: prompts.summary,
        sender: 'user',
        timestamp: new Date()
    });

    const summary: string | null = await generateTherapistMessage(prompts.therapist.short, messages);

    if (!summary) {
        throw new Error('Summary not generated');
    }

    prompts = await loadPrompts(chatroom.userContext, summary);

    messages = [
        {
            id: '2',
            content: `${prompts.welcome}`,
            sender: 'system',
            timestamp: new Date()
        }
    ];
    const aiTherapistWellcome: string | null = await generateTherapistMessage(prompts.therapist.short, messages);
    if (!aiTherapistWellcome) {
        throw new Error('Therapist wellcome not generated');
    }
    messages = [
        {
            id: crypto.randomUUID(),
            content: aiTherapistWellcome,
            sender: 'system',
            timestamp: new Date()
        }
    ]

    await db.collection('chatrooms').doc(chatRoomId).update({
        summary,
        messages
    });

    return {
        success: true
    }
});