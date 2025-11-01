// types  guide.tsx

export interface Article {
  title: string;
  image: string;
  category: string;
  section: string;
}

export interface ArticleSection {
  [key: string]: Article[];
}

export interface ArticleModalProps {
  article: any;
  isOpen: boolean;
  onClose: () => void;
}