import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What-If Simulation",
  description:
    "Simulate demand surge scenarios to see how increased consumption affects medicine runway across all facilities. Identify which facilities become critical under stress conditions.",
};

export default function SimulationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
