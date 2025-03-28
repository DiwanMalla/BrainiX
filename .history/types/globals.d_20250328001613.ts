export {};

export type Roles = "student" | "instructor" | "admin";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
