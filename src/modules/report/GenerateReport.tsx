"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/card";
export function GenerateReport() {
  const { t } = useTranslation("common");
  const [reportType, setReportType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleExport = () => {
    console.log("Export report:", { reportType, fromDate, toDate });
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>{t("reportsPage.generateReport.title")}</CardTitle>
        <CardDescription>{t("reportsPage.generateReport.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">{t("reportsPage.generateReport.reportType")}</label>
          <select
            className="w-full px-3 py-2 border rounded-md mt-1"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="">{t("reportsPage.generateReport.selectReportType")}</option>
            <option value="test-orders">Test Orders</option>
            <option value="results">Test Results</option>
            <option value="inventory">Inventory</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">{t("reportsPage.generateReport.fromDate")}</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md mt-1"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">{t("reportsPage.generateReport.toDate")}</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md mt-1"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleExport} className="flex-1">
            {t("reportsPage.generateReport.exportExcel")}
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            {t("reportsPage.generateReport.print")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
