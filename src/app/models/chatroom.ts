import { Message } from './message';

export class Chatroom {
    public id?: string;
    readonly description: string;
    readonly therapistId: number;
    readonly userContext: string;
    readonly createdAt: Date;
    private updatedAt: Date;
    public messages: Message[];
    private userId: string;

    constructor(therapistId: number, description: string, userContext: string, userId: string, messages: Message[] = [], id?: string) {
        this.therapistId = therapistId;
        this.description = description;
        this.userContext = userContext;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.messages = messages;
        this.userId = userId;
        this.id = id;
    }

    addMessage(message: Message): void {
        this.messages.push(message);
        this.updatedAt = new Date();
    }

    getObject(): Chatroom {
        const obj = Object.assign({}, this);
        delete obj.id;
        return obj;
    }
}
