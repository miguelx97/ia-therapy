import { getDatabase } from 'firebase-admin/database';
import { Prompts } from './models/prompts';

let prompts: Prompts;

export async function loadPrompts(context: string): Promise<Prompts> {
    if (prompts) return prompts;
    const db = getDatabase();
    const promptRef = db.ref('prompts');
    const snapshot = await promptRef.get();
    if (!snapshot.exists()) {
        throw new Error('Prompts not found');
    }

    prompts = snapshot.val() as Prompts;
    // Replace [Context] with [Context] ${context} in all prompt strings
    const promptsJson = JSON.stringify(prompts);
    prompts = JSON.parse(promptsJson.replace('[Context]', `[Context] ${context}`));
    return prompts;
}