export interface UserInfo {
    id?: string;
    name?: string;
    email?: string;
    selectedChatRoom?: string;
    chatrooms?: { id: string, description: string }[];
}
