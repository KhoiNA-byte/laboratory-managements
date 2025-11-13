"use client";
import { useDispatch, useSelector } from "react-redux";
import { HeaderReport } from "./Header";
import { GenerateReport } from "./GenerateReport";
import { QuickReports } from "./QuickReport";
import { ScheduledReports } from "./ScheduleReport";

export default function ReportsPage1() {
  // const dispatch = useDispatch();
  // const { loading } = useSelector((state: any) => state.reports);

  return (
    <main className="flex-1 p-6">
      <HeaderReport />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <GenerateReport />
        <QuickReports />
      </div>
      <ScheduledReports />
    </main>
  );
}
