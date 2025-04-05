export interface Message {
    id: string;
    content: string;
    sender: MessageSender;
    timestamp: Date;
}
type MessageSender = 'user' | 'system';