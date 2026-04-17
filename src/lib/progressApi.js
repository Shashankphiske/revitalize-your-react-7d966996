// API client for tracking LeetCode question progress.
// Backend is expected to expose:
//   GET  {BASE}/user?topic=<topic>   -> { topic, completedQuestions: number[] }
//   POST {BASE}/user                 -> body: { topic, completedQuestions: number[] }
// User identity is derived from the request IP server-side.
//
// Configure the base URL via Vite env var: VITE_PROGRESS_API_URL
// Falls back to "/api" so a same-origin reverse proxy also works.

const BASE_URL =
  (import.meta.env && import.meta.env.VITE_PROGRESS_API_URL) || "/api";

export async function fetchProgress(topic) {
  try {
    const res = await fetch(
      `${BASE_URL}/user?topic=${encodeURIComponent(topic)}`,
      { method: "GET", credentials: "include" }
    );
    if (!res.ok) throw new Error(`GET /user failed: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data?.completedQuestions) ? data.completedQuestions : [];
  } catch (err) {
    console.warn("[progressApi] fetchProgress failed, falling back to local:", err);
    return readLocal(topic);
  }
}

export async function saveProgress(topic, completedQuestions) {
  // Always mirror locally so a backend outage doesn't lose user state.
  writeLocal(topic, completedQuestions);
  try {
    const res = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, completedQuestions }),
    });
    if (!res.ok) throw new Error(`POST /user failed: ${res.status}`);
    return true;
  } catch (err) {
    console.warn("[progressApi] saveProgress failed:", err);
    return false;
  }
}

// --- localStorage fallback ---
const LS_KEY = (topic) => `dsa-progress:${topic}`;

function readLocal(topic) {
  try {
    const raw = localStorage.getItem(LS_KEY(topic));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(topic, ids) {
  try {
    localStorage.setItem(LS_KEY(topic), JSON.stringify(ids));
  } catch {
    /* ignore quota errors */
  }
}
