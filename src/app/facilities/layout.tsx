import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthcare Facilities",
  description:
    "Overview of all monitored healthcare facilities in Rajasthan. See overall risk scores, critical medicine counts, and facility-level inventory summaries across 10 districts.",
};

export default function FacilitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
