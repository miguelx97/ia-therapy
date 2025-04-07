import { onCall } from "firebase-functions/https";
import { log } from "firebase-functions/logger";
import { DocumentReference, DocumentSnapshot, getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { Chatroom } from "./models/chatroom";
import { Message } from "./models/message";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { AI } from "./ai";
import { UserInfo } from "./models/userInfo";
import { therapistPrompt, chatroomTitlePrompt, summaryPrompt, therapistShortPrompt } from "./promts";
// Initialize Firebase Admin
initializeApp();

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

    const context = therapistPrompt(userContext);

    const iaResponse: string | null = await generateTherapistMessage(context, messages);

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

    const iaDescription: string | null = await AI.reply(chatroomTitlePrompt(chatroom.userContext), 100);

    // get user info by auth
    const user = request.auth;
    if (!user) {
        throw new Error('User not found');
    }

    if (iaDescription) chatroom.description = iaDescription;
    chatroom.userId = user.uid;
    chatroom.messages = [];

    log("!!!chatroom:", chatroom);

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
        description: chatroom.description
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

    const messages: Message[] = chatroom.messages;
    messages.push({
        id: crypto.randomUUID(),
        content: summaryPrompt(chatroom.userContext),
        sender: 'user',
        timestamp: new Date()
    });

    const summary: string | null = await generateTherapistMessage(therapistShortPrompt(chatroom.userContext), messages);

    await db.collection('chatrooms').doc(chatRoomId).update({
        summary
    });

    return {
        success: true
    }
});