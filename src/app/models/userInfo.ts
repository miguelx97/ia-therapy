export interface UserInfo {
    id?: string;
    name?: string;
    email?: string;
    selectedChatRoom?: string;
    chatrooms?: { id: string, description: string }[];
}

export function createUserInfo(id?: string, name?: string, email?: string): UserInfo {
    return {
        id,
        name: name || '',
        email: email || '',
    };
}
