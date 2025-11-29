import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { eventService } from '../../services/eventApi'
import { INSTRUMENT_ACTION_TYPES } from '../../store/sagas/instrumentSaga'

interface MetricCardProps {
    title: string
    value: string
    subtitle?: string
    icon: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">{icon}</span>
                </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-2">{value}</div>
            {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
            )}
        </div>
    )
}

interface EventItemProps {
    type: 'success' | 'warning' | 'error' | 'info'
    title: string
    tag: string
    details: string
    timestamp: string
    user: string
}

const EventItem: React.FC<EventItemProps> = ({ type, title, tag, details, timestamp, user }) => {
    const getIconAndColor = () => {
        switch (type) {
            case 'success':
                return { 
                    icon: '✓', 
                    bgColor: 'bg-green-500', 
                    textColor: 'text-green-800', 
                    bgLight: 'bg-green-100'
                }
            case 'warning':
                return { 
                    icon: '!', 
                    bgColor: 'bg-orange-500', 
                    textColor: 'text-orange-800',
                    bgLight: 'bg-orange-100'
                }
            case 'error':
                return { 
                    icon: '✕', 
                    bgColor: 'bg-red-500', 
                    textColor: 'text-red-800',
                    bgLight: 'bg-red-100'
                }
            case 'info':
                return { 
                    icon: 'i', 
                    bgColor: 'bg-blue-500', 
                    textColor: 'text-blue-800',
                    bgLight: 'bg-blue-100'
                }
            default:
                return { 
                    icon: 'i', 
                    bgColor: 'bg-gray-500', 
                    textColor: 'text-gray-800',
                    bgLight: 'bg-gray-100'
                }
        }
    }

    const { icon, bgColor, textColor, bgLight } = getIconAndColor()

    return (
        <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
            <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                <span className="text-white text-sm font-bold">{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${textColor} ${bgLight} border`}>
                        {tag}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{details}</p>
                <p className="text-xs text-gray-400">{timestamp} by {user}</p>
            </div>
        </div>
    )
}

// Sử dụng environment variables
const API_BASE = import.meta.env.VITE_MOCKAPI_BASE_URL

// API service functions
const fetchUsers = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE}${import.meta.env.VITE_MOCKAPI_USERS_ENDPOINT}`)
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
}

const fetchTests = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE}${import.meta.env.VITE_MOCKAPI_TEST_ORDERS_ENDPOINT}`)
    if (!response.ok) throw new Error('Failed to fetch tests')
    return response.json()
}

const fetchInstruments = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE}${import.meta.env.VITE_MOCKAPI_INSTRUMENTS_ENDPOINT}`)
    if (!response.ok) throw new Error('Failed to fetch instruments')
    return response.json()
}

export const MonitoringPage = () => {
    const { t } = useTranslation("common");
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview')
    const [metrics, setMetrics] = useState<any[]>([])
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [eventFilters, setEventFilters] = useState({
        type: 'all',
        search: ''
    })
    
    // Lấy instruments từ Redux store
    const { instruments: instrumentsFromRedux, loading: instrumentsLoading } = useSelector((state: RootState) => state.instruments)

    // Format timestamp function
    const formatTimestamp = (timestamp: string) => {
        try {
            return new Date(timestamp).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return new Date().toLocaleString()
        }
    }

    // Filter events
    const filteredEvents = events.filter(event => {
        const matchesType = eventFilters.type === 'all' || event.type === eventFilters.type
        const matchesSearch = eventFilters.search === '' || 
            event.title.toLowerCase().includes(eventFilters.search.toLowerCase()) ||
            event.description.toLowerCase().includes(eventFilters.search.toLowerCase()) ||
            event.user.toLowerCase().includes(eventFilters.search.toLowerCase())
        return matchesType && matchesSearch
    })

    // Log tab changes
    useEffect(() => {
        eventService.logEvent({
            type: 'info',
            title: `Monitoring Tab Changed to ${activeTab}`,
            category: 'navigation',
            description: `User switched to ${activeTab} tab in monitoring dashboard`,
            user: 'Current User'
        })
    }, [activeTab])

    // Log filter changes
    useEffect(() => {
        if (eventFilters.search || eventFilters.type !== 'all') {
            eventService.logEvent({
                type: 'info',
                title: 'Event Filters Applied',
                category: 'monitoring',
                description: `User filtered events: search="${eventFilters.search}", type="${eventFilters.type}"`,
                user: 'Current User'
            })
        }
    }, [eventFilters.search, eventFilters.type])

    // Fetch instruments khi vào trang monitoring
    useEffect(() => {
        dispatch({ type: 'FETCH_INSTRUMENTS_START' })

    }, [dispatch])

    // Tính toán metrics từ API THẬT
    useEffect(() => {
        const loadMetrics = async () => {
            try {
                setLoading(true)
                
                // Log bắt đầu load monitoring data
                await eventService.logEvent({
                    type: 'info',
                    title: 'Loading Monitoring Data',
                    category: 'monitoring',
                    description: 'Starting to load real-time monitoring metrics from all APIs',
                    user: 'Current User'
                })

                // Fetch data THẬT từ các API
                const [usersData, testsData, eventsData, instrumentsData] = await Promise.all([
                    fetchUsers(),
                    fetchTests(),
                    eventService.fetchEvents(),
                    fetchInstruments()
                ])

                // Log monitoring page access thành công
                await eventService.logEvent({
                    type: 'success',
                    title: 'Monitoring Dashboard Loaded Successfully',
                    category: 'system',
                    description: `Monitoring dashboard loaded with ${usersData.length} users, ${testsData.length} tests, ${eventsData.length} events, ${instrumentsData.length} instruments`,
                    user: 'Current User'
                })

                // Lọc tests trong ngày hôm nay - DÙNG DATA THẬT
                const today = new Date().toISOString().split('T')[0]
                const todayTests = testsData.filter((test: any) => {
                    const testDate = test.createdAt || test.date || test.timestamp
                    return testDate && testDate.startsWith(today)
                })

                // Tính active instruments - DÙNG DATA THẬT
                const instrumentsToUse = instrumentsData.length > 0 ? instrumentsData : instrumentsFromRedux
                const activeInstruments = instrumentsToUse.filter((instr: any) => {
                    const status = instr.status?.toLowerCase()
                    return status === 'active' || status === 'operational' || status === 'running'
                }).length

                // TÍNH TOÁN SỐ LƯỢNG THẬT
                const newMetrics = [
                    {
                        title: t('monitoringPage.metrics.activeUsers'),
                        value: usersData.length.toString(),
                        subtitle: t('monitoringPage.metrics.activeUsersSubtitle'),
                        icon: '👥'
                    },
                    {
                        title: t('monitoringPage.metrics.testsToday'),
                        value: todayTests.length.toString(),
                        subtitle: t('monitoringPage.metrics.testsTodaySubtitle'),
                        icon: '📈'
                    },
                    {
                        title: t('monitoringPage.metrics.activeInstruments'),
                        value: activeInstruments.toString(),
                        subtitle: t('monitoringPage.metrics.activeInstrumentsSubtitle'),
                        icon: '⚙️'
                    }
                ]

                console.log('Real metrics data:', {
                    users: usersData.length,
                    testsToday: todayTests.length,
                    activeInstruments: activeInstruments,
                    totalInstruments: instrumentsToUse.length
                })

                setMetrics(newMetrics)
                setEvents(eventsData)

                // Log metrics calculation thành công
                await eventService.logEvent({
                    type: 'success',
                    title: 'Monitoring Metrics Calculated',
                    category: 'monitoring',
                    description: `Calculated metrics: ${usersData.length} users, ${todayTests.length} tests today, ${activeInstruments} active instruments`,
                    user: 'System'
                })

            } catch (error) {
                console.error('Error loading real metrics:', error)
                
                // Log lỗi chi tiết
                await eventService.logError(
                    'Monitoring Data Loading',
                    error instanceof Error ? error : new Error('Unknown error'),
                    'Current User'
                )

                // Fallback: dùng data từ Redux store
                try {
                    const usersCount = '16' // Có thể lấy từ auth context sau này
                    const testsCount = '5' // Có thể tính từ test orders trong store
                    const activeInstrumentsCount = instrumentsFromRedux.filter((instr: any) => 
                        instr.status?.toLowerCase() === 'active'
                    ).length

                    setMetrics([
                        {
                            title: t('monitoringPage.metrics.activeUsers'),
                            value: usersCount,
                            subtitle: t('monitoringPage.metrics.activeUsersSubtitle'),
                            icon: '👥'
                        },
                        {
                            title: t('monitoringPage.metrics.testsToday'),
                            value: testsCount,
                            subtitle: t('monitoringPage.metrics.testsTodaySubtitle'),
                            icon: '📈'
                        },
                        {
                            title: t('monitoringPage.metrics.activeInstruments'),
                            value: activeInstrumentsCount.toString(),
                            subtitle: t('monitoringPage.metrics.activeInstrumentsSubtitle'),
                            icon: '⚙️'
                        }
                    ])

                    // Log fallback data usage
                    await eventService.logEvent({
                        type: 'warning',
                        title: 'Using Fallback Monitoring Data',
                        category: 'monitoring',
                        description: 'Using fallback data from Redux store due to API failures',
                        user: 'System'
                    })

                } catch (fallbackError) {
                    // Ultimate fallback
                    setMetrics([
                        {
                            title: t('monitoringPage.metrics.activeUsers'),
                            value: '0',
                            subtitle: t('monitoringPage.metrics.activeUsersSubtitle'),
                            icon: '👥'
                        },
                        {
                            title: t('monitoringPage.metrics.testsToday'),
                            value: '0',
                            subtitle: t('monitoringPage.metrics.testsTodaySubtitle'),
                            icon: '📈'
                        },
                        {
                            title: t('monitoringPage.metrics.activeInstruments'),
                            value: '0',
                            subtitle: t('monitoringPage.metrics.activeInstrumentsSubtitle'),
                            icon: '⚙️'
                        }
                    ])

                    // Log critical fallback
                    await eventService.logEvent({
                        type: 'error',
                        title: 'Critical Monitoring Data Failure',
                        category: 'monitoring',
                        description: 'All data sources failed, using zero values as fallback',
                        user: 'System'
                    })
                }
            } finally {
                setLoading(false)
            }
        }

        loadMetrics()
    }, [instrumentsFromRedux, t])

    // Format events từ API
    const formatEvents = (rawEvents: any[]) => {
        return rawEvents.map((event: any) => ({
            type: event.type || 'info',
            title: event.title || 'System Event',
            tag: event.category || 'system',
            details: event.description || 'No description available',
            timestamp: formatTimestamp(event.timestamp),
            user: event.user || 'System'
        }))
    }

    // Handler cho user actions
    const handleViewAllEvents = () => {
        eventService.logEvent({
            type: 'info',
            title: 'View All Events Clicked',
            category: 'navigation',
            description: 'User clicked View All button to see complete event log',
            user: 'Current User'
        })
        setActiveTab('logs')
    }

    const handleRefreshData = async () => {
        eventService.logEvent({
            type: 'info',
            title: 'Manual Data Refresh',
            category: 'monitoring',
            description: 'User manually triggered data refresh in monitoring dashboard',
            user: 'Current User'
        })
        
        // Reload page để refresh data
        window.location.reload()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">{t("monitoringPage.eventLogs.loading")}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t("monitoringPage.title")}</h1>
                        <p className="text-gray-500 mt-1">{t("monitoringPage.subtitle")}</p>
                    </div>
                    <button 
                        onClick={handleRefreshData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        {t("monitoringPage.refresh") || "Refresh Data"}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t("monitoringPage.tabs.overview")}
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'logs'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t("monitoringPage.tabs.logs")}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
                {activeTab === 'overview' ? (
                    <div className="space-y-8">
                        {/* Metrics Section với data THẬT */}
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {metrics.map((metric, index) => (
                                    <MetricCard
                                        key={index}
                                        title={metric.title}
                                        value={metric.value}
                                        subtitle={metric.subtitle}
                                        icon={metric.icon}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Recent Events Section */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">{t("monitoringPage.recentEvents.title")}</h2>
                                        <p className="text-sm text-gray-500 mt-1">{t("monitoringPage.recentEvents.subtitle")}</p>
                                    </div>
                                    <button 
                                        onClick={handleViewAllEvents}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {t("monitoringPage.recentEvents.viewAll")}
                                    </button>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {formatEvents(events.slice(0, 5)).map((event, index) => (
                                    <EventItem
                                        key={index}
                                        type={event.type}
                                        title={event.title}
                                        tag={event.tag}
                                        details={event.details}
                                        timestamp={event.timestamp}
                                        user={event.user}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder={t("monitoringPage.eventLogs.searchPlaceholder")}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={eventFilters.search}
                                        onChange={(e) => setEventFilters(prev => ({
                                            ...prev,
                                            search: e.target.value
                                        }))}
                                    />
                                </div>
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={eventFilters.type}
                                    onChange={(e) => setEventFilters(prev => ({
                                        ...prev,
                                        type: e.target.value
                                    }))}
                                >
                                    <option value="all">{t("monitoringPage.eventLogs.allTypes")}</option>
                                    <option value="success">{t("monitoringPage.eventLogs.success")}</option>
                                    <option value="info">{t("monitoringPage.eventLogs.info")}</option>
                                    <option value="warning">{t("monitoringPage.eventLogs.warning")}</option>
                                    <option value="error">{t("monitoringPage.eventLogs.error")}</option>
                                </select>
                            </div>
                        </div>

                        {/* Event Logs */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">{t("monitoringPage.eventLogs.title")}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {t("monitoringPage.eventLogs.subtitle", { count: filteredEvents.length })}
                                </p>
                            </div>
                            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                {filteredEvents.length > 0 ? (
                                    formatEvents(filteredEvents).map((event, index) => (
                                        <EventItem
                                            key={index}
                                            type={event.type}
                                            title={event.title}
                                            tag={event.tag}
                                            details={event.details}
                                            timestamp={event.timestamp}
                                            user={event.user}
                                        />
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        {t("monitoringPage.eventLogs.noEventsFound")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}