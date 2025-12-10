export interface GreetingState {
  recipient: string;
  message: string;
  isLoading: boolean;
  error: string | null;
}

export interface TreeConfig {
  height: number;
  radius: number;
  count: number;
  goldRatio: number; // Percentage of ornaments that are gold vs emerald
}