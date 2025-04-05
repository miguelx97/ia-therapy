import { Chatroom } from "./chatroom";

export class UserInfo {
    id?: string;
    name?: string;
    email?: string;
    chatRooms?: Chatroom[];

    constructor(id: string, name: string, email: string, chatRooms: Chatroom[]) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.chatRooms = chatRooms;
    }
}
