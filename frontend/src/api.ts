import axios from "axios";
import type { ShortenInput, ShortenResponse, StatsResponse } from "./types";

const BASE_URL = "http://localhost:5000"; 

export const shortenURL = async (data: ShortenInput): Promise<ShortenResponse> => {
  const res = await axios.post(`${BASE_URL}/shorturls`, data);
  return res.data;
};

export const getURLStats = async (shortcode: string): Promise<StatsResponse> => {
  const res = await axios.get(`${BASE_URL}/shorturls/${shortcode}/stats`);
  return res.data;
};
