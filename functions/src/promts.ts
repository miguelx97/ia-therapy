import { getDatabase } from 'firebase-admin/database';
import { Prompts } from './models/prompts';
import { log } from 'firebase-functions/logger';

let prompts: Prompts;

export async function loadPrompts(context: string, summary?: string): Promise<Prompts> {
    if (!prompts) {
        const db = getDatabase();
        const promptRef = db.ref('prompts');
        const snapshot = await promptRef.get();
        if (!snapshot.exists()) {
            throw new Error('Prompts not found');
        }

        prompts = snapshot.val() as Prompts;
    }
    // Replace [Context] with [Context] ${context} in all prompt strings
    const promptsJson = JSON.stringify(prompts);
    const contextStr = context ? `[Context] ${context}` : '';
    let promptReplaced = promptsJson.replace(/\[Context\]/g, contextStr);
    const summaryStr = summary ? `[Last session summary] ${summary}` : '';
    promptReplaced = promptReplaced.replace(/\[Last session summary\]/g, summaryStr);
    prompts = JSON.parse(promptReplaced) as Prompts;
    log("!!!prompts:", prompts);
    return prompts;
}