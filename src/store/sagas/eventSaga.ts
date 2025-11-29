// services/eventService.ts
const BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL;
const EVENT_ENDPOINT = import.meta.env.VITE_MOCKAPI_EVENT_ENDPOINT;
const EVENT_FULL_URL = `${BASE_URL}${EVENT_ENDPOINT}`;

export interface EventData {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  category: string;
  description: string;
  timestamp: string;
  user: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}

class EventService {
  // Core logging function
  async logEvent(eventData: Omit<EventData, 'id' | 'timestamp'>): Promise<EventData | null> {
    try {
      const event: Omit<EventData, 'id'> = {
        ...eventData,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(EVENT_FULL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });

      if (!response.ok) throw new Error('Failed to log event');
      return await response.json();
      
    } catch (error) {
      console.error('Event logging failed:', error);
      return null;
    }
  }

  async fetchEvents(): Promise<EventData[]> {
    try {
      const response = await fetch(`${EVENT_FULL_URL}?sortBy=timestamp&order=desc`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('Fetch events failed:', error);
      throw error;
    }
  }

  // ==================== INSTRUMENT MANAGEMENT ====================
  async logInstrumentCreated(instrument: { id: string; name: string }, user: string): Promise<void> {
    await this.logEvent({
      type: 'success',
      title: `Instrument Created: ${instrument.name}`,
      category: 'instrument',
      description: `Created new instrument: ${instrument.name}`,
      user: user,
      resourceId: instrument.id
    });
  }

  async logInstrumentUpdated(instrument: { id: string; name: string }, user: string): Promise<void> {
    await this.logEvent({
      type: 'success',
      title: `Instrument Updated: ${instrument.name}`,
      category: 'instrument',
      description: `Updated instrument: ${instrument.name}`,
      user: user,
      resourceId: instrument.id
    });
  }

  async logInstrumentDeleted(instrument: { id: string; name: string }, user: string): Promise<void> {
    await this.logEvent({
      type: 'warning',
      title: `Instrument Deleted: ${instrument.name}`,
      category: 'instrument',
      description: `Deleted instrument: ${instrument.name}`,
      user: user,
      resourceId: instrument.id
    });
  }

  // ==================== USER MANAGEMENT ====================
  async logUserCreated(userData: { id: string; username: string }, adminUser: string): Promise<void> {
    await this.logEvent({
      type: 'success',
      title: `User Created: ${userData.username}`,
      category: 'user_management',
      description: `Created new user account: ${userData.username}`,
      user: adminUser,
      resourceId: userData.id
    });
  }

  async logUserUpdated(userData: { id: string; username: string }, adminUser: string): Promise<void> {
    await this.logEvent({
      type: 'success',
      title: `User Updated: ${userData.username}`,
      category: 'user_management',
      description: `Updated user account: ${userData.username}`,
      user: adminUser,
      resourceId: userData.id
    });
  }

  async logUserDeleted(userData: { id: string; username: string }, adminUser: string): Promise<void> {
    await this.logEvent({
      type: 'warning',
      title: `User Deleted: ${userData.username}`,
      category: 'user_management',
      description: `Deleted user account: ${userData.username}`,
      user: adminUser,
      resourceId: userData.id
    });
  }

  async logUserLogin(username: string): Promise<void> {
    await this.logEvent({
      type: 'info',
      title: `User Login: ${username}`,
      category: 'authentication',
      description: `User logged into the system`,
      user: username
    });
  }

  async logUserLogout(username: string): Promise<void> {
    await this.logEvent({
      type: 'info',
      title: `User Logout: ${username}`,
      category: 'authentication',
      description: `User logged out of the system`,
      user: username
    });
  }

  // ==================== TEST ORDER MANAGEMENT ====================
  async logTestOrderCreated(order: { id: string; orderNumber: string }, user: string): Promise<void> {
    await this.logEvent({
      type: 'success',
      title: `Test Order Created: ${order.orderNumber}`,
      category: 'test_order',
      description: `Created new test order: ${order.orderNumber}`,
      user: user,
      resourceId: order.id
    });
  }

  async logTestOrderUpdated(order: { id: string; orderNumber: string }, user: string): Promise<void> {
    await this.logEvent({
      type: 'success',
      title: `Test Order Updated: ${order.orderNumber}`,
      category: 'test_order',
      description: `Updated test order: ${order.orderNumber}`,
      user: user,
      resourceId: order.id
    });
  }

  async logTestOrderDeleted(order: { id: string; orderNumber: string }, user: string): Promise<void> {
    await this.logEvent({
      type: 'warning',
      title: `Test Order Deleted: ${order.orderNumber}`,
      category: 'test_order',
      description: `Deleted test order: ${order.orderNumber}`,
      user: user,
      resourceId: order.id
    });
  }

  async logTestResultSubmitted(result: { id: string; testId: string }, user: string): Promise<void> {
    await this.logEvent({
      type: 'success',
      title: `Test Result Submitted`,
      category: 'test_result',
      description: `Submitted test results for test: ${result.testId}`,
      user: user,
      resourceId: result.id
    });
  }

  // ==================== SYSTEM & MAINTENANCE ====================
  async logSystemBackup(adminUser: string): Promise<void> {
    await this.logEvent({
      type: 'info',
      title: `System Backup Performed`,
      category: 'system_maintenance',
      description: `System backup completed successfully`,
      user: adminUser
    });
  }

  async logDataExport(exportType: string, user: string, recordCount: number): Promise<void> {
    await this.logEvent({
      type: 'info',
      title: `Data Exported: ${exportType}`,
      category: 'data_management',
      description: `Exported ${recordCount} ${exportType} records`,
      user: user
    });
  }

  async logDataImport(importType: string, user: string, recordCount: number): Promise<void> {
    await this.logEvent({
      type: 'info',
      title: `Data Imported: ${importType}`,
      category: 'data_management',
      description: `Imported ${recordCount} ${importType} records`,
      user: user
    });
  }

  // ==================== SETTINGS & CONFIGURATION ====================
  async logSettingsUpdated(settingsType: string, user: string): Promise<void> {
    await this.logEvent({
      type: 'info',
      title: `Settings Updated: ${settingsType}`,
      category: 'settings',
      description: `Updated ${settingsType} settings`,
      user: user
    });
  }

  async logConfigurationChanged(configType: string, user: string): Promise<void> {
    await this.logEvent({
      type: 'warning',
      title: `Configuration Changed: ${configType}`,
      category: 'configuration',
      description: `Changed system configuration: ${configType}`,
      user: user
    });
  }

  // ==================== ERROR LOGGING ====================
  async logError(
    context: string,
    error: Error | string,
    user: string = 'System',
    resourceId?: string
  ): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : error;
    
    await this.logEvent({
      type: 'error',
      title: `Error in ${context}`,
      category: 'error',
      description: `Error occurred: ${errorMessage}`,
      user: user,
      resourceId: resourceId,
      metadata: {
        context,
        stackTrace: error instanceof Error ? error.stack : undefined
      }
    });
  }

  // ==================== GENERIC ACTION LOGGING ====================
  async logGenericAction(
    action: string,
    category: string,
    user: string,
    details?: string,
    resourceId?: string
  ): Promise<void> {
    await this.logEvent({
      type: 'info',
      title: `Action: ${action}`,
      category: category,
      description: details || `User performed action: ${action}`,
      user: user,
      resourceId: resourceId
    });
  }
}

export const eventService = new EventService();