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

      console.log('📝 Logging event:', event);

      const response = await fetch(EVENT_FULL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const savedEvent = await response.json();
      console.log('✅ Event logged successfully:', savedEvent);
      return savedEvent;

    } catch (error) {
      console.error('❌ Event logging failed:', error);
      // Fallback: Always log to console
      console.warn('📝 EVENT FALLBACK (Not saved to API):', eventData);
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

  // ==================== INSTRUMENT EVENT LOGGING ====================

  async logInstrumentCreated(instrument: { id: string; name: string; type?: string; brand?: string }, user: string): Promise<void> {
    await this.logEvent({
      type: 'success',
      title: `Instrument Created: ${instrument.name}`,
      category: 'instrument',
      description: `Created new instrument: ${instrument.name} (${instrument.brand || 'No brand'} - ${instrument.type || 'No type'})`,
      user: user,
      resourceId: instrument.id,
      metadata: {
        instrumentId: instrument.id,
        instrumentName: instrument.name,
        instrumentType: instrument.type,
        instrumentBrand: instrument.brand,
        operation: 'create'
      }
    });
  }

  async logInstrumentUpdated(instrument: { id: string; name: string; type?: string; brand?: string }, user: string, changes?: string[]): Promise<void> {
    const changesText = changes && changes.length > 0 
      ? `Changes: ${changes.join(', ')}`
      : 'Instrument details updated';

    await this.logEvent({
      type: 'success',
      title: `Instrument Updated: ${instrument.name}`,
      category: 'instrument',
      description: `Updated instrument: ${instrument.name}. ${changesText}`,
      user: user,
      resourceId: instrument.id,
      metadata: {
        instrumentId: instrument.id,
        instrumentName: instrument.name,
        instrumentType: instrument.type,
        instrumentBrand: instrument.brand,
        operation: 'update',
        changes: changes
      }
    });
  }

  async logInstrumentDeleted(instrument: { id: string; name: string; type?: string; brand?: string }, user: string): Promise<void> {
    await this.logEvent({
      type: 'warning',
      title: `Instrument Deleted: ${instrument.name}`,
      category: 'instrument',
      description: `Deleted instrument: ${instrument.name} (${instrument.brand || 'No brand'} - ${instrument.type || 'No type'})`,
      user: user,
      resourceId: instrument.id,
      metadata: {
        instrumentId: instrument.id,
        instrumentName: instrument.name,
        instrumentType: instrument.type,
        instrumentBrand: instrument.brand,
        operation: 'delete'
      }
    });
  }

  async logInstrumentError(operation: 'create' | 'update' | 'delete', instrumentData: any, user: string, error: string): Promise<void> {
    const operations = {
      create: 'Create Instrument',
      update: 'Update Instrument', 
      delete: 'Delete Instrument'
    };

    await this.logEvent({
      type: 'error',
      title: `${operations[operation]} Failed`,
      category: 'instrument',
      description: `Failed to ${operation} instrument${instrumentData.name ? `: ${instrumentData.name}` : ''}. Error: ${error}`,
      user: user,
      resourceId: instrumentData.id,
      metadata: {
        operation: operation,
        instrumentId: instrumentData.id,
        instrumentName: instrumentData.name,
        errorMessage: error,
        instrumentData: instrumentData
      }
    });
  }

  async logInstrumentFetch(user: string, success: boolean, error?: string, count?: number): Promise<void> {
    if (success) {
      await this.logEvent({
        type: 'success',
        title: `Instruments Fetched Successfully`,
        category: 'instrument',
        description: `Successfully fetched ${count} instruments`,
        user: user,
        metadata: {
          operation: 'fetch',
          instrumentCount: count
        }
      });
    } else {
      await this.logEvent({
        type: 'error',
        title: `Failed to Fetch Instruments`,
        category: 'instrument',
        description: `Failed to fetch instruments: ${error}`,
        user: user,
        metadata: {
          operation: 'fetch',
          errorMessage: error
        }
      });
    }
  }

  async logInstrumentStatusChanged(instrument: { id: string; name: string }, oldStatus: string, newStatus: string, user: string): Promise<void> {
    await this.logEvent({
      type: 'info',
      title: `Instrument Status Changed: ${instrument.name}`,
      category: 'instrument',
      description: `Instrument status changed from "${oldStatus}" to "${newStatus}"`,
      user: user,
      resourceId: instrument.id,
      metadata: {
        instrumentId: instrument.id,
        instrumentName: instrument.name,
        oldStatus: oldStatus,
        newStatus: newStatus,
        operation: 'status_change'
      }
    });
  }
}

export const eventService = new EventService();