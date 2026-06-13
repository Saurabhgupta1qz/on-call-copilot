export interface AnalysisResponse {
  analysis: string;
}

export interface TeachResponse {
  status: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

