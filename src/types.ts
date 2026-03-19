export interface SummaryResult {
  oneSentenceSummary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence?: number;
}

export type Sentiment = 'positive' | 'neutral' | 'negative';
