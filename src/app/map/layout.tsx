import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regional Facility Map",
  description:
    "Interactive geographic map of all 10 Rajasthan healthcare facilities. View inventory depletion status, shortage risk zones, and redistribution routes on a live OpenStreetMap layer.",
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
