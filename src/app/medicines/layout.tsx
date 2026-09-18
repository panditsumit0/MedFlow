import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicine Inventory",
  description:
    "Track stock levels, daily consumption rates, and depletion timelines for all essential medicines across Rajasthan healthcare facilities. Filter by risk level or district.",
};

export default function MedicinesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
