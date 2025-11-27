declare module '*.css';

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_BACKEND_URL?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
  }
}