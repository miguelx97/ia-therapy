import { Message } from './message';

export class ChatContext {
    constructor(
        public systemPrompt: string
    ) { }
}

export class Chatroom {
    readonly id: string;
    name: string;
    description: string;
    readonly createdAt: Date;
    private _updatedAt: Date;
    private _messages: Message[];
    context: ChatContext;

    constructor(name: string, description: string, systemPrompt: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.description = description;
        this.createdAt = new Date();
        this._updatedAt = new Date();
        this._messages = [];
        this.context = new ChatContext(systemPrompt);
    }

    get messages(): Message[] {
        return [...this._messages]; // Return a copy to prevent direct modification
    }

    addMessage(message: Message): void {
        this._messages.push(message);
        this._updatedAt = new Date();
    }

    updateName(newName: string): void {
        this.name = newName;
        this._updatedAt = new Date();
    }

    updateContext(systemPrompt: string): void {
        this.context = new ChatContext(systemPrompt);
        this._updatedAt = new Date();
    }
}

// Factory function if needed
export const createChatroom = (name: string, description: string, systemPrompt: string): Chatroom => {
    return new Chatroom(name, description, systemPrompt);
};
