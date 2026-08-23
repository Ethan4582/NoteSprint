import { Metadata } from "next";
import ProgressClient from "@/src/components/progress/ProgressClient";

export const metadata: Metadata = {
  title: "My Progress & History · NoteSprint",
  description: "Track your personal session scores, accuracy rates, and flashcard performance history.",
};

export default function ProgressPage() {
  return <ProgressClient />;
}
