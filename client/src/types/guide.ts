export interface ArticleContent {
  headline?: string;
  intro?: string;
  sections?: Array<{
    title?: string;
    content?: string;
    points?: string[];
  }>;
  source?: string;
}

export interface Article {
  id: string;
  title: string;
  image: string;
  category: string;
  section: string;
  externalLink?: string;
  content?: ArticleContent;
}

export interface ArticleSection {
  [key: string]: Article[];
}

export interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}