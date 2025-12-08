import { MediaSource } from "../constants/media-sources";
import { EntryStatus } from "../enums/entry-status";

export interface EntryData { 
    id: string // UUID v4
    title: string;
    content?: string;
    mediaUrl?: string;
    mediaSource: MediaSource;
    summary?: string;

    date: Date; // anything for simplicity
    tags?: string[];
    author: string;
    status: EntryStatus;
}
