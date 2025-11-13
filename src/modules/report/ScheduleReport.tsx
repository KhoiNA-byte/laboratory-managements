"use client";
import { Button } from "../../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/card";

const SCHEDULED = [
  { id: 1, name: "Daily Test Summary", schedule: "Sent every day at 6:00 PM" },
  {
    id: 2,
    name: "Weekly Inventory Report",
    schedule: "Sent every Monday at 9:00 AM",
  },
  {
    id: 3,
    name: "Monthly Performance Report",
    schedule: "Sent on the 1st of each month",
  },
];

export function ScheduledReports() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Scheduled Reports</CardTitle>
        <CardDescription>
          Automatically generated reports sent via email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {SCHEDULED.map((report) => (
            <div
              key={report.id}
              className="flex justify-between items-center p-3 border rounded-md"
            >
              <div>
                <p className="font-medium">{report.name}</p>
                <p className="text-sm text-muted-foreground">
                  {report.schedule}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
