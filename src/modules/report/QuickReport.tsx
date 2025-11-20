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

export function QuickReports() {
  const { t } = useTranslation("common");
  
  const QUICK_REPORTS = [
    { id: 1, label: t("reportsPage.quickReports.todaysTestOrders") },
    { id: 2, label: t("reportsPage.quickReports.pendingTestResults") },
    { id: 3, label: t("reportsPage.quickReports.instrumentStatusReport") },
    { id: 4, label: t("reportsPage.quickReports.lowStockReagents") },
    { id: 5, label: t("reportsPage.quickReports.userActivityLog") },
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{t("reportsPage.quickReports.title")}</CardTitle>
        <CardDescription>{t("reportsPage.quickReports.subtitle")}</CardDescription>
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
