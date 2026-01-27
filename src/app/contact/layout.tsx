import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Faith Companion AI",
  description:
    "Contact Faith Companion AI support for questions, feedback, or help with your account or premium subscription.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
