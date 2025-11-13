"use client";

import { useState } from "react";
import { Button } from "../../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/card";
export function GenerateReport() {
  const [reportType, setReportType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleExport = () => {
    console.log("Export report:", { reportType, fromDate, toDate });
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
        <CardDescription>Select report type and date range</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Report Type</label>
          <select
            className="w-full px-3 py-2 border rounded-md mt-1"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="">Select report type</option>
            <option value="test-orders">Test Orders</option>
            <option value="results">Test Results</option>
            <option value="inventory">Inventory</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">From Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md mt-1"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">To Date</label>
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
            Export Excel
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
