export interface BackendMessage {
  error: boolean,
  message?: string,
  data?: any,
  status?: string,
  state?: string,
  algorithms?: [],
  result?: any,
  taskstatusurl?: string
}
