const PREFIX = 'agriconnect:';

export function removeAppData() {
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(PREFIX)) localStorage.removeItem(key);
  }
}

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function removeKey(key) {
  localStorage.removeItem(PREFIX + key);
}
