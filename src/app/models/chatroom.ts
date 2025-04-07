import { Message } from './message';

export interface Chatroom {
    id?: string;
    readonly description: string;
    therapistId: number;
    userContext: string;
    readonly createdAt: Date;
    updatedAt: Date;
    messages: Message[];
    summary?: string;
    userId?: string;
    // userName?: string;
}

export function createChatroom(
    description: string,
    therapistId: number,
    userContext: string,
    userId?: string,
    id?: string,
    messages?: Message[],
): Chatroom {
    return {
        id,
        description,
        therapistId,
        userContext,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: messages || [],
    };
}

export function addMessage(chatroom: Chatroom, message: Message): Chatroom {
    return {
        ...chatroom,
        messages: [...chatroom.messages, message],
    };
}

export const defaultChatroom = () => createChatroom('Your AI therapist', -1, '', '');
