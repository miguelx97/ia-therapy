// import { log } from "firebase-functions/logger";
// import { loadPrompts } from "./promts";
// import { onCall } from "firebase-functions/https";
import { initializeApp } from "firebase-admin/app";
initializeApp();

export { talkWithTherapist, createUpdateChatRoom, therapySummary } from "./chat";

// export const test = onCall(async (request) => {
//     const prompts = await loadPrompts("TEST TEST TEST");
//     log(prompts);
//     return { prompts };
// });