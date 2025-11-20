export interface TestResultData {
  testOrderId: string;
  patient: string;
  date: string;
  tester: string;
  status: string;
  sex: string;
  parameters: TestParameter[];
  hl7_raw?: string;
}

export interface TestParameter {
  parameter: string;        
  result: string | number;  
  unit: string;            
  referenceRange: string;  
  deviation: string;      
  flag: string; 
  appliedEvaluate?: string; 
}