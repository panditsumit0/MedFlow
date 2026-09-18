import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock Redistribution",
  description:
    "Redistribution recommendations to move surplus medicine stock from well-supplied facilities to facilities facing critical shortages. Optimised by geography and urgency.",
};

export default function RedistributionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
