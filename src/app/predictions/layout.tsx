import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shortage Predictions",
  description:
    "AI-assisted shortage risk predictions for essential medicines across Rajasthan. Ranked by urgency with days-remaining forecasts and facility-level breakdown.",
};

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
