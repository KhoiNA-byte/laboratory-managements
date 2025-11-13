// services/eventService.ts
const BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL
const EVENT_ENDPOINT = import.meta.env.VITE_MOCKAPI_EVENT_ENDPOINT
const EVENT_FULL_URL = `${BASE_URL}${EVENT_ENDPOINT}`

export const eventService = {
  // For direct use in components (non-saga)
  logEvent: async (eventData: any) => {
    try {
      const response = await fetch(EVENT_FULL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventData,
          timestamp: new Date().toISOString()
        })
      })
      if (!response.ok) throw new Error('Failed to log event')
      return await response.json()
    } catch (error) {
      console.error('Event logging failed:', error)
      // Fail silently for non-critical logging
      return null
    }
  },

  fetchEvents: async () => {
    try {
      const response = await fetch(`${EVENT_FULL_URL}?sortBy=timestamp&order=desc`)
      if (!response.ok) throw new Error('Failed to fetch events')
      return await response.json()
    } catch (error) {
      console.error('Fetch events failed:', error)
      throw error
    }
  },

  // Helper function để tạo event data chuẩn
  createEventData: (data: {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    category: string
    description: string
    user: string
    resourceId?: string
  }) => ({
    ...data,
    timestamp: new Date().toISOString()
  })
}