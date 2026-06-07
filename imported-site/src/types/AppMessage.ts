export interface ErrorMessage {
  type: "error";
  source: string;
  payload: {
    name: string;
    message: string;
    stack?: string;
    componentStack?: string | null;
  };
}
