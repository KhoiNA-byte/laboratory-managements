"use client";

import { Button } from "../../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/card";

const QUICK_REPORTS = [
  { id: 1, label: "Today's Test Orders" },
  { id: 2, label: "Pending Test Results" },
  { id: 3, label: "Instrument Status Report" },
  { id: 4, label: "Low Stock Reagents" },
  { id: 5, label: "User Activity Log" },
];

export function QuickReports() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Quick Reports</CardTitle>
        <CardDescription>Generate commonly used reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {QUICK_REPORTS.map((report) => (
          <Button
            key={report.id}
            variant="ghost"
            className="w-full justify-start"
          >
            📥 {report.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
