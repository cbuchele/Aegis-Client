import { createOpenAI } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createXai } from "@ai-sdk/xai";
import { createOllama } from 'ollama-ai-provider';
import { DEFAULT_OLLAMA_HOST, OLLAMA_HOST_KEY } from "@/lib/config";
import { 
  customProvider, 
  wrapLanguageModel, 
  extractReasoningMiddleware 
} from "ai";

export interface ModelInfo {
  provider: string;
  name: string;
  description: string;
  apiVersion: string;
  capabilities: string[];
}

const middleware = extractReasoningMiddleware({
  tagName: 'think',
});

// Helper to get API keys from environment variables first, then localStorage
const getApiKey = (key: string): string | undefined => {
  // Check for environment variables first
  if (process.env[key]) {
    return process.env[key] || undefined;
  }
  
  // Fall back to localStorage if available
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key) || undefined;
  }
  
  return undefined;
};

const getOllamaHost = (): string => {
  if (typeof window !== 'undefined') {
    const val = window.localStorage.getItem(OLLAMA_HOST_KEY);
    return typeof val === 'string' && val.length > 0 ? val : DEFAULT_OLLAMA_HOST;
  }
  const envVal = process.env.OLLAMA_HOST;
  return typeof envVal === 'string' && envVal.length > 0 ? envVal : DEFAULT_OLLAMA_HOST;
};

console.log('[Ollama] Using baseURL:', getOllamaHost());

// Create provider instances with API keys from localStorage
const openaiClient = createOpenAI({
  apiKey: getApiKey('OPENAI_API_KEY'),
});

const anthropicClient = createAnthropic({
  apiKey: getApiKey('ANTHROPIC_API_KEY'),
});

const groqClient = createGroq({
  apiKey: getApiKey('GROQ_API_KEY'),
});

const xaiClient = createXai({
  apiKey: getApiKey('XAI_API_KEY'),
});

const ollamaClient = createOllama({
  baseURL: getOllamaHost(),
});

const languageModels = {
  "gpt-4.1-mini": openaiClient("gpt-4.1-mini"),
  "claude-3-7-sonnet": anthropicClient('claude-3-7-sonnet-20250219'),
  "qwen-qwq": wrapLanguageModel(
    {
      model: groqClient("qwen-qwq-32b"),
      middleware
    }
  ),
  "grok-3-mini": xaiClient("grok-3-mini-latest"),
  "llama3": ollamaClient('llama3'),
  "mistral": ollamaClient('mistral'),
  "llava": ollamaClient('llava'),
  "qwen3": ollamaClient('qwen3'),
};

export const modelDetails: Record<keyof typeof languageModels, ModelInfo> = {
  "gpt-4.1-mini": {
    provider: "OpenAI",
    name: "GPT-4.1 Mini",
    description: "Compact version of OpenAI's GPT-4.1 with good balance of capabilities, including vision.",
    apiVersion: "gpt-4.1-mini",
    capabilities: ["Balance", "Creative", "Vision"]
  },
  "claude-3-7-sonnet": {
    provider: "Anthropic",
    name: "Claude 3.7 Sonnet",
    description: "Latest version of Anthropic's Claude 3.7 Sonnet with strong reasoning and coding capabilities.",
    apiVersion: "claude-3-7-sonnet-20250219",
    capabilities: ["Reasoning", "Efficient", "Agentic"]
  },
  "qwen-qwq": {
    provider: "Groq",
    name: "Qwen QWQ",
    description: "Latest version of Alibaba's Qwen QWQ with strong reasoning and coding capabilities.",
    apiVersion: "qwen-qwq",
    capabilities: ["Reasoning", "Efficient", "Agentic"]
  },
  "grok-3-mini": {
    provider: "XAI",
    name: "Grok 3 Mini",
    description: "Latest version of XAI's Grok 3 Mini with strong reasoning and coding capabilities.",
    apiVersion: "grok-3-mini-latest",
    capabilities: ["Reasoning", "Efficient", "Agentic"]
  },
  "llama3": {
    provider: "Ollama",
    name: "Llama 3",
    description: "The latest Llama 3 model from Meta, running locally via Ollama.",
    apiVersion: "llama3",
    capabilities: ["Local", "Fast", "Reasoning"]
  },
  "mistral": {
    provider: "Ollama",
    name: "Mistral",
    description: "The popular Mistral 7B model, running locally via Ollama.",
    apiVersion: "mistral",
    capabilities: ["Local", "Fast", "Coding"]
  },
  "llava": {
    provider: "Ollama",
    name: "LLaVA",
    description: "A local multimodal model (vision) that can describe images.",
    apiVersion: "llava",
    capabilities: ["Local", "Vision", "Efficient"]
  },
  "qwen3": {
    provider: "Ollama",
    name: "Qwen 3",
    description: "The latest Qwen 3 model, running locally via Ollama.",
    apiVersion: "qwen3",
    capabilities: ["Local", "Fast", "Reasoning"]
  },
};

// Update API keys or Ollama host when localStorage changes
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    // Reload the page if any API key or the Ollama host changed to refresh the providers
    if (event.key?.includes('API_KEY') || event.key === OLLAMA_HOST_KEY) {
      window.location.reload();
    }
  });
}

export const model = customProvider({
  languageModels,
});

export type modelID = keyof typeof languageModels;

export const MODELS = Object.keys(languageModels);

export const defaultModel: modelID = "qwen-qwq";
