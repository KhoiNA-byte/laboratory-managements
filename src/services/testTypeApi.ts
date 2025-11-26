import { API_BASE_URL, USERS_ENDPOINT } from "./apiConfig";
import { TestType } from "../types/testType";


export const getTestTypes = async (): Promise<{ success: boolean; data: TestType[]; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/test_type`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const testTypes: TestType[] = await response.json();
    
    return {
      success: true,
      data: testTypes,
    };
  } catch (error) {
    console.error('Error fetching test types:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
