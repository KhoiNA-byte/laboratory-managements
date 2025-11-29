import { TestResultData } from "../types/testResult.ts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportExcelFile = (testResultData: TestResultData): void => {
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
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US').replace(/\//g, '-'); // MM-DD-YYYY
  const patientName = testResultData.patient;
  const fileName = `Test Orders-${patientName}-${dateStr}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  

};

export const exportPdfFile = (testResultData: TestResultData): void => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Test Result Report", 105, 15, { align: "center" });
  
  // Basic Info Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", 14, 30);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let yPos = 38;
  doc.text(`Test Order ID: ${testResultData.testOrderId}`, 14, yPos);
  yPos += 6;
  doc.text(`Patient: ${testResultData.patient}`, 14, yPos);
  yPos += 6;
  doc.text(`Sex: ${testResultData.sex}`, 14, yPos);
  yPos += 6;
  doc.text(`Date Run: ${testResultData.date}`, 14, yPos);
  yPos += 6;
  doc.text(`Tester: ${testResultData.tester}`, 14, yPos);
  yPos += 6;
  doc.text(`Status: ${testResultData.status}`, 14, yPos);
  yPos += 10;
  
  // Test Parameters Table
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Test Parameters", 14, yPos);
  yPos += 5;
  
  const tableData = testResultData.parameters.map(param => [
    param.parameter,
    String(param.result),
    param.unit,
    param.referenceRange,
    param.deviation,
    param.flag,
    param.appliedEvaluate || "-"
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [["Parameter", "Result", "Unit", "Reference", "Deviation", "Flag", "Evaluate"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [68, 114, 196],
      textColor: 255,
      fontStyle: "bold",
      halign: "center"
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20, halign: "right" },
      2: { cellWidth: 20 },
      3: { cellWidth: 30 },
      4: { cellWidth: 20, halign: "right" },
      5: { cellWidth: 20, halign: "center" },
      6: { cellWidth: 25 }
    },
    didParseCell: function(data) {
      // Color code flags
      if (data.column.index === 5 && data.section === "body") {
        const flag = data.cell.text[0];
        if (flag === "High" || flag === "Critical") {
          data.cell.styles.fillColor = [255, 200, 200];
          data.cell.styles.textColor = [200, 0, 0];
        } else if (flag === "Low") {
          data.cell.styles.fillColor = [255, 250, 200];
          data.cell.styles.textColor = [200, 150, 0];
        } else if (flag === "Normal") {
          data.cell.styles.fillColor = [200, 255, 200];
          data.cell.styles.textColor = [0, 150, 0];
        }
      }
    }
  });
  
  // HL7 Raw Data (if exists and space available)
  const finalY = (doc as any).lastAutoTable.finalY;
  if (testResultData.hl7_raw && finalY < 250) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("HL7 Raw Message", 14, finalY + 10);
    
    doc.setFontSize(7);
    doc.setFont("courier", "normal");
    const hl7Lines = testResultData.hl7_raw.split("\n");
    let hl7YPos = finalY + 16;
    
    hl7Lines.forEach((line, index) => {
      if (hl7YPos > 280) {
        doc.addPage();
        hl7YPos = 20;
      }
      doc.text(line.substring(0, 100), 14, hl7YPos);
      hl7YPos += 4;
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  
  // Save file
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US').replace(/\//g, '-');
  const patientName = testResultData.patient;
  const fileName = `Test Orders-${patientName}-${dateStr}.pdf`;
  doc.save(fileName);
};