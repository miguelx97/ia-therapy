export class Message {
    private id?: string;
    public content?: string;
    public sender?: MessageSender;
    private timestamp?: Date;

    constructor() {
    }

    createMessage(content: string, sender: MessageSender): Message {
        this.id = crypto.randomUUID();
        this.content = content;
        this.sender = sender;
        this.timestamp = new Date();
        return this;
    }

    messageFromFirestore(message: Message): Message {
        this.id = message.id;
        this.content = message.content;
        this.sender = message.sender;
        // Handle Firestore Timestamp conversion
        if (message.timestamp && 'seconds' in message.timestamp) {
            const timestamp = message.timestamp as unknown as { seconds: number; nanoseconds: number };
            this.timestamp = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        } else {
            this.timestamp = message.timestamp as Date;
        }
        return this;
    }

    getFormattedTimestamp(): string {
        return this.timestamp?.toLocaleString() ?? '';
    }

    getObject(): Message {
        return Object.assign({}, this);
    }

}

type MessageSender = 'user' | 'system';