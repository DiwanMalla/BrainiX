export {};

export type Roles = "student" | "instructor" | "admin";

export interface RedirectCallbackResult {
  status: "complete" | "failed" | string;
  [key: string]: any;
}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
