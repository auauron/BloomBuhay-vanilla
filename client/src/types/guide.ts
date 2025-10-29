export interface Article {
  title: string;
  image: string;
  category: string;
  section: string;
}

export interface ArticleSection {
  [key: string]: Article[];
}