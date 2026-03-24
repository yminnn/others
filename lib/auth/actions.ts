"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function authenticate(_previousState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.type === "CredentialsSignin" ? "Invalid email or password." : "Unable to sign in right now.";
    }

    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
