// Frontend-only data service loading JSON from /public/data

const fetchJSON = async (path) => {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`);
  }
  return res.json();
};

// Philosopher endpoints
export const philosopherAPI = {
  getAll: async () => {
    const data = await fetchJSON('/data/philosophers.json');
    return { data };
  },
  getById: async (id) => {
    const data = await fetchJSON('/data/philosophers.json');
    const found = data.find((p) => String(p.id) === String(id));
    if (!found) throw new Error('Philosopher not found');
    return { data: found };
  },
};

// Quote endpoints
export const quoteAPI = {
  getByPhilosopherId: async (philosopherId) => {
    const data = await fetchJSON('/data/quotes.json');
    const filtered = data.filter((q) => String(q.philosopherId) === String(philosopherId));
    return { data: filtered };
  },
};

// Chapter endpoints
export const chapterAPI = {
  getAll: async () => {
    const data = await fetchJSON('/data/chapters.json');
    return { data };
  },
  getById: async (id) => {
    const data = await fetchJSON('/data/chapters.json');
    const found = data.find((c) => String(c.id) === String(id));
    if (!found) throw new Error('Chapter not found');
    return { data: found };
  },
};

// Question endpoints
export const questionAPI = {
  getByChapterId: async (chapterId) => {
    const data = await fetchJSON(`/data/questions-${chapterId}.json`);
    return { data };
  },
};

export default {
  fetchJSON,
};
