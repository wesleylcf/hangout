export interface User {
  username: string;
  password: string;
}

interface Error {
  error: string;
}

export type ValidateUserOutcome = User | Error;
