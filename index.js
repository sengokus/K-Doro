import { initDb, initFirebase } from "./firebaseConfig.js";

const app = initFirebase();
export const db = initDb(app);