import { API_BASE_URL } from "../services/apiConfig";

/**
 * Get the highest customUserId from the API for today
 * @returns Promise containing the highest customUserId number for today
 */
export const getCurrentCustomUserId = async (): Promise<string> => {
  try {
    // Get today's date in YYYYMMDD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`; // e.g., "20251113"

    // Fetch all users and filter by customUserId starting with today's date
    const response = await fetch(`${API_BASE_URL}/user?sortBy=customUserId&order=desc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users: any[] = await response.json();
    
    // Filter users with customUserId starting with today's date prefix
    const todayUsers = users.filter(user => 
      user.customUserId && user.customUserId.startsWith(datePrefix)
    );

    if (todayUsers.length > 0) {
      // Get the highest customUserId for today
      const highestCustomUserId = todayUsers[0].customUserId;
      return highestCustomUserId;
    }
    
    // No users created today, return base ID for today
    return `${datePrefix}00000`;
  } catch (error) {
    console.error('Error fetching current custom user ID:', error);
    // Return base ID for today as fallback
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}00000`;
  }
};

/**
 * Generate next customUserId based on current highest ID for today
 * Format: YYYYMMDDNNNNN (e.g., 2025111300001)
 * @returns Promise containing new customUserId string
 */
export const generateCustomUserId = async (): Promise<string> => {
  try {
    // Get current highest custom user ID for today
    const currentCustomUserId = await getCurrentCustomUserId();
    
    // Extract the date prefix (YYYYMMDD) and sequence number (NNNNN)
    const datePrefix = currentCustomUserId.substring(0, 8); // "20251113"
    const sequenceStr = currentCustomUserId.substring(8); // "00000" or "00001", etc.
    const sequenceNum = parseInt(sequenceStr) || 0;
    
    // Increment sequence number
    const nextSequenceNum = sequenceNum + 1;
    
    // Format: pad with zeros to make it 5 digits
    const nextSequence = String(nextSequenceNum).padStart(5, '0');
    
    // Combine date prefix with new sequence
    const nextCustomUserId = `${datePrefix}${nextSequence}`;
    
    console.log('Generated customUserId:', nextCustomUserId);
    
    return nextCustomUserId;
    
  } catch (error) {
    console.error('Error generating custom user ID:', error);
    // Fallback: return today's date + 00001
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}00001`;
  }
};

/**
 * Get today's date prefix for customUserId (YYYYMMDD)
 * @returns Today's date in YYYYMMDD format
 */
export const getTodayDatePrefix = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};
