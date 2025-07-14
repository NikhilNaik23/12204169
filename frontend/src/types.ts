export interface ShortenInput {
  url: string;
  validity?: number;
  shortcode?: string;
}

export interface ShortenResponse {
  shortlink: string;
  expiry: string;
}

export interface ClickDetail {
  timestamp: string;
  source: string;
  location?: string;
}

export interface StatsResponse {
  originalUrl: string;
  shortlink: string;
  createdAt: string;
  expiry: string;
  totalClicks: number;
  clickDetails: ClickDetail[];
}