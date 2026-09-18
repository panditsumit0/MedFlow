import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Active Alerts",
  description:
    "Real-time shortage alerts across Rajasthan healthcare facilities. View critical, high, and warning-level inventory alerts with recommended response actions.",
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
