export interface Photo {
  id: string;
  file: File | string; // File object for new uploads, string URL for existing
  name?: string;
  notes?: string;
  createdAt: string;
  uploadedAt: string;
}

export interface Album {
  id: string;
  title: string;
  coverPhoto: string | any; // URL or base64
  photos: Photo[];
  createdAt: string;
  lastUpdated: string;
  description: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  photo?: string | any; // base64 or URL for single photo
  createdAt: string;
  lastUpdated: string;
  tags: string[];
  mood: string;
}