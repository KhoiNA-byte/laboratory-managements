"use client";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/card";

export function ScheduledReports() {
  const { t } = useTranslation("common");
  
  const SCHEDULED = [
    { id: 1, name: t("reportsPage.scheduledReports.dailyTestSummary"), schedule: t("reportsPage.scheduledReports.dailyTestSummaryDesc") },
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t("reportsPage.scheduledReports.title")}</CardTitle>
        <CardDescription>
          {t("reportsPage.scheduledReports.subtitle")}
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
                {t("reportsPage.scheduledReports.configure")}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
