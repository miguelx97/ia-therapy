import { Chatroom } from "./chatroom";

export class User {
    id?: string;
    name?: string;
    email?: string;
    chatRooms?: Chatroom[];
}
