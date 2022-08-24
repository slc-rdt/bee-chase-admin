declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      BLUEJACK_API_URL: string;
    }
  }
}

export {};
