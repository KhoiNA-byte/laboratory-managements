import { TestResultData } from "../types/testResult.ts";
import * as XLSX from "xlsx";

export const exportFile = (testResultData: TestResultData): void => {
  // Tạo workbook mới
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Thông tin cơ bản
  const basicInfoData = [
    ["Test Result Export"],
    [],
    ["Test Order ID", testResultData.testOrderId],
    ["Patient", testResultData.patient],
    ["Sex", testResultData.sex],
    ["Date", testResultData.date],
    ["Tester", testResultData.tester],
    ["Status", testResultData.status],
  ];
  const basicInfoSheet = XLSX.utils.aoa_to_sheet(basicInfoData);
  XLSX.utils.book_append_sheet(workbook, basicInfoSheet, "Basic Info");

  // Sheet 2: Parameters (Test Results)
  const parametersData = [
    ["Parameter", "Result", "Unit", "Reference Range", "Deviation", "Flag", "Applied Evaluate"]
  ];
  
  testResultData.parameters.forEach((param) => {
    parametersData.push([
      param.parameter,
      String(param.result),
      param.unit,
      param.referenceRange,
      param.deviation,
      param.flag,
      param.appliedEvaluate || "-"
    ]);
  });
  
  const parametersSheet = XLSX.utils.aoa_to_sheet(parametersData);
  XLSX.utils.book_append_sheet(workbook, parametersSheet, "Test Parameters");

  // Sheet 3: HL7 Raw Data (nếu có)
  if (testResultData.hl7_raw) {
    const hl7Lines = testResultData.hl7_raw.split("\n");
    const hl7Data = [["HL7 Raw Message"], [], ...hl7Lines.map(line => [line])];
    const hl7Sheet = XLSX.utils.aoa_to_sheet(hl7Data);
    XLSX.utils.book_append_sheet(workbook, hl7Sheet, "HL7 Raw");
  }

  // Export file
  const fileName = `TestResult_${testResultData.testOrderId}_${new Date().getTime()}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  
  console.log(`✅ Exported to ${fileName}`);
};

