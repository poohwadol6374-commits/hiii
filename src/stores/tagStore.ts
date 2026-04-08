import { create } from "zustand";

export interface Tag {
  id: string;
  name: string;
  color: string; // tailwind color key
}

const defaultTags: Tag[] = [
  { id: "tag-1", name: "finance", color: "blue" },
  { id: "tag-2", name: "report", color: "green" },
  { id: "tag-3", name: "code-review", color: "yellow" },
  { id: "tag-4", name: "team", color: "red" },
  { id: "tag-5", name: "design", color: "purple" },
  { id: "tag-6", name: "ui", color: "pink" },
  { id: "tag-7", name: "meeting", color: "orange" },
  { id: "tag-8", name: "notes", color: "gray" },
  { id: "tag-9", name: "devops", color: "teal" },
  { id: "tag-10", name: "automation", color: "indigo" },
  { id: "tag-11", name: "writing", color: "cyan" },
  { id: "tag-12", name: "react", color: "blue" },
  { id: "tag-13", name: "cleanup", color: "gray" },
];

interface TagStore {
  tags: Tag[];
  addTag: (name: string, color?: string) => Tag;
  deleteTag: (id: string) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  getTagByName: (name: string) => Tag | undefined;
}

const colorPool = ["blue", "green", "yellow", "red", "purple", "pink", "orange", "teal", "indigo", "cyan"];

export const useTagStore = create<TagStore>((set, get) => ({
  tags: defaultTags,

  addTag: (name, color) => {
    const existing = get().tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: name.toLowerCase(),
      color: color || colorPool[get().tags.length % colorPool.length],
    };
    set((s) => ({ tags: [...s.tags, newTag] }));
    return newTag;
  },

  deleteTag: (id) => set((s) => ({ tags: s.tags.filter((t) => t.id !== id) })),

  updateTag: (id, updates) => set((s) => ({
    tags: s.tags.map((t) => t.id === id ? { ...t, ...updates } : t),
  })),

  getTagByName: (name) => get().tags.find((t) => t.name.toLowerCase() === name.toLowerCase()),
}));

// Color mapping for rendering
export const tagColorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-google-blue-50", text: "text-google-blue-700", border: "border-google-blue-200" },
  green: { bg: "bg-google-green-50", text: "text-google-green-700", border: "border-google-green-200" },
  yellow: { bg: "bg-google-yellow-50", text: "text-google-yellow-700", border: "border-google-yellow-200" },
  red: { bg: "bg-google-red-50", text: "text-google-red-700", border: "border-google-red-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  pink: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  gray: { bg: "bg-lumina-100", text: "text-lumina-600", border: "border-lumina-200" },
};
