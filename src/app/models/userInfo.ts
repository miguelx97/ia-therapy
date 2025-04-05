import { Chatroom } from "./chatroom";

export class UserInfo {
    id?: string;
    name?: string;
    email?: string;
    selectedChatRoom?: number;

    constructor(name: string, id?: string) {
        this.id = id;
        this.name = name;
        this.email = '';
        this.selectedChatRoom = 1;
    }

    getObject(): UserInfo {
        const userInfo = Object.assign({}, this);
        delete userInfo.id;
        return userInfo;
    }
}
