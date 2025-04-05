import { Message } from "./message";


export interface Chatroom {
    id?: string;
    description: string;
    therapistId: number;
    userContext: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
    userId: string;
}
