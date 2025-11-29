import { API_BASE_URL } from "../config";

// Use the environment variable for the backend URL with fallback for development

// client/src/services/aiService.ts
export interface AIRequest {
  question: string;
  context?: 'pregnancy' | 'postpartum' | 'childcare' | 'general' | 'health';
}

export interface AIResponse {
  success: boolean;
  response: string;
  source: 'gemini-ai' | 'fallback';
  note?: string;
}

class AIService {
  // API base URL from config
  private baseURL = `${API_BASE_URL}/api/ai`;
  async askBloomGuide(request: AIRequest): Promise<AIResponse> {
    try {



      const response = await fetch(`${this.baseURL}/bloomguide/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });



      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AIResponse = await response.json();

      return data;
    } catch (error) {
      console.error('❌ AI Service Error:', error);
      throw new Error('AI features are currently unavailable. Please try again later.');
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/bloomguide/health`);

      return response.ok;
    } catch (error) {
      console.error('❌ AI Health check failed:', error);
      return false;
    }
  }

  // For ArticleModal integration
  async generateArticleSummary(title: string, content: string): Promise<string> {
    try {
      const response = await this.askBloomGuide({
        question: `Please provide a concise summary of this article about ${title}. Focus on key takeaways for mothers.`,
        context: 'general'
      });
      return response.response;
    } catch (error) {
      throw new Error('Unable to generate summary at this time.');
    }
  }

  isAIAvailable(): boolean {
    return true;
  }
}

export const aiService = new AIService();