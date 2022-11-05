declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_BASE_PATH: string;
      NEXT_PUBLIC_BEECHASE_CURRENT_START_DATE: string;
      NEXT_PUBLIC_BEECHASE_CURRENT_END_DATE: string;
    }
  }
}

export {};
