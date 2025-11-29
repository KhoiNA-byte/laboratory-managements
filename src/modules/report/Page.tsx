"use client";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { HeaderReport } from "./Header";
import { GenerateReport } from "./GenerateReport";
import { QuickReports } from "./QuickReport";
import { ScheduledReports } from "./ScheduleReport";

export default function ReportsPage1() {
  const { t } = useTranslation("common");
  // const dispatch = useDispatch();
  // const { loading } = useSelector((state: any) => state.reports);

  return (
    <main className="flex-1 p-6">
      <div>
        <h1 className="text-3xl font-bold">{t("reportsPage.title")}</h1>
        <p className="text-muted-foreground">
          {t("reportsPage.subtitle")}
        </p>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-2">{t("reportsPage.sectionTitle")}</h2>
        <p className="text-gray-600 mb-4">{t("reportsPage.sectionSubtitle")}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <GenerateReport />
        <QuickReports />
      </div>
      <ScheduledReports />
    </main>
  );
}
