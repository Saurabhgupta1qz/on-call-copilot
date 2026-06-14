import { AnalysisResponse, TeachResponse } from "../types";

export class ApiService {
  public static getBaseUrl(): string {
    
    return localStorage.getItem("COPILOT_BACKEND_URL") || "https://on-call-copilot.onrender.com";
  }

  public static setBaseUrl(url: string): void {
    localStorage.setItem("COPILOT_BACKEND_URL", url);
  }

  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || `Failed: HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  // Analyze a live incident using the FastAPI analyze endpoint
  static async analyzeIncident(incidentText: string): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>("/analyze", {
      method: "POST",
      body: JSON.stringify({ incident: incidentText }),
    });
  }

  // Save a new post-mortem directly to regional hindsight memory using the FastAPI teach endpoint
  static async teachIncident(incidentText: string): Promise<TeachResponse> {
    return this.request<TeachResponse>("/teach", {
      method: "POST",
      body: JSON.stringify({ incident: incidentText }),
    });
  }
}

