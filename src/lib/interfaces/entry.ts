export interface EntryData { 
    id: string // UUID v4
    title: string;
    content: string;
    mediaUrl?: string;
    createdAt: Date;
    tags?: string[];
}
