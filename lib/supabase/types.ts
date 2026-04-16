export type Mood =
  | "happy"
  | "calm"
  | "neutral"
  | "anxious"
  | "overwhelmed"
  | "sad"
  | "angry";

export type Entry = {
  id: string;
  user_id: string;
  mood: Mood;
  tags: string[];
  note: string;
  ai_response: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      entries: {
        Row: Entry;
        Insert: Omit<Entry, "id" | "user_id" | "created_at" | "updated_at"> & {
          id?: string;
          user_id?: string;
        };
        Update: Partial<Omit<Entry, "id" | "user_id" | "created_at">>;
      };
    };
  };
};
