// src/app/sign-in/page.tsx
// /sign-in is an alias — canonical auth page is /login
import { redirect } from "next/navigation";

export default function SignInPage() {
  redirect("/login");
}
