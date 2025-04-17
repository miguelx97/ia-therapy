export interface Prompts {
    therapist: Therapist;
    chatroomTitle: string;
    summary: string;
    welcome: string;
}

export interface Therapist {
    full: string;
    short: string;
}
