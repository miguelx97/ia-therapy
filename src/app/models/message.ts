export class Message {
    readonly id: string;
    content: string;
    sender: MessageSender;
    readonly timestamp: Date;

    constructor(content: string, sender: MessageSender) {
        this.id = crypto.randomUUID();
        this.content = content;
        this.sender = sender;
        this.timestamp = new Date();
    }

    getFormattedTimestamp(): string {
        return this.timestamp.toLocaleString();
    }

    updateContent(newContent: string): void {
        this.content = newContent;
    }
}

// Factory function if needed
export const createMessage = (content: string, sender: MessageSender): Message => {
    return new Message(content, sender);
};

type MessageSender = 'user' | 'ai';