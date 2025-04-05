import { Message } from './message';

export class Chatroom {
    readonly id: string;
    readonly description: string;
    readonly therapistId: number;
    readonly userContext: string;
    readonly createdAt: Date;
    private _updatedAt: Date;
    private _messages: Message[];

    constructor(therapistId: number, description: string, userContext: string) {
        this.id = crypto.randomUUID();
        this.therapistId = therapistId;
        this.description = description;
        this.userContext = userContext;
        this.createdAt = new Date();
        this._updatedAt = new Date();
        this._messages = [];
    }

    get messages(): Message[] {
        return [...this._messages]; // Return a copy to prevent direct modification
    }

    addMessage(message: Message): void {
        this._messages.push(message);
        this._updatedAt = new Date();
    }

    getObject(): Chatroom {
        return Object.assign({}, this);
    }
}
