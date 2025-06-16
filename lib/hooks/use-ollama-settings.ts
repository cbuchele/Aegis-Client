"use client";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
// Import from your new config file
import { OLLAMA_HOST_KEY, DEFAULT_OLLAMA_HOST } from "@/lib/config";

export function useOllamaSettings() {
  const [ollamaHost, setOllamaHost] = useLocalStorage(
    OLLAMA_HOST_KEY,
    DEFAULT_OLLAMA_HOST
  );

  return {
    ollamaHost,
    setOllamaHost,
  };
}