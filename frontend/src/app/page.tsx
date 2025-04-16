// src/app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  // Immediately redirect users from the root path to the dashboard
  redirect("/dashboard");

  // You can return null as the redirect happens server-side
  // return null;
}
