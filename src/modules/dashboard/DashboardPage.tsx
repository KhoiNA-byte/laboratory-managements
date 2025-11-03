import React from 'react'

export const DashboardPage = () => {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Patients */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Patients</p>
                            <p className="text-3xl font-bold text-gray-900">2,847</p>
                            <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
                        </div>
                        <div className="w-12 h-12 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Pending Tests */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Pending Tests</p>
                            <p className="text-3xl font-bold text-gray-900">47</p>
                            <p className="text-sm text-red-600 mt-1">+3 from yesterday</p>
                        </div>
                        <div className="w-12 h-12 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Active Instruments */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Active Instruments</p>
                            <p className="text-3xl font-bold text-gray-900">12/15</p>
                            <p className="text-sm text-gray-500 mt-1">3 under maintenance</p>
                        </div>
                        <div className="w-12 h-12 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Alerts</p>
                            <p className="text-3xl font-bold text-gray-900">5</p>
                            <p className="text-sm text-gray-500 mt-1">2 critical, 3 warnings</p>
                        </div>
                        <div className="w-12 h-12 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Test Orders */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Recent Test Orders</h3>
                            <p className="text-sm text-gray-600">Latest test orders requiring attention</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'John Doe', test: 'Complete Blood Count', status: 'pending', time: '10 minutes ago', statusColor: 'bg-gray-100 text-gray-800' },
                            { name: 'Jane Smith', test: 'Lipid Panel', status: 'in progress', time: '25 minutes ago', statusColor: 'bg-blue-100 text-blue-800' },
                            { name: 'Bob Johnson', test: 'Liver Function Test', status: 'in progress', time: '1 hour ago', statusColor: 'bg-blue-100 text-blue-800' },
                            { name: 'Alice Williams', test: 'Thyroid Panel', status: 'completed', time: '2 hours ago', statusColor: 'bg-blue-600 text-white' },
                        ].map((order, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{order.name}</p>
                                    <p className="text-sm text-gray-600">{order.test}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.statusColor}`}>
                                        {order.status}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Alerts */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                            <p className="text-sm text-gray-600">Important notifications and warnings</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                title: 'Low Reagent Stock',
                                description: 'CBC Reagent Kit below 20%',
                                time: '5 min ago',
                                type: 'critical',
                                icon: 'exclamation',
                                color: 'text-red-600'
                            },
                            {
                                title: 'Calibration Due',
                                description: 'Hematology Analyzer needs calibration',
                                time: '1 hour ago',
                                type: 'warning',
                                icon: 'exclamation',
                                color: 'text-yellow-600'
                            },
                            {
                                title: 'Instrument Maintenance',
                                description: 'Chemistry Analyzer scheduled maintenance',
                                time: '2 hours ago',
                                type: 'info',
                                icon: 'info',
                                color: 'text-blue-600'
                            },
                            {
                                title: 'Quality Control Alert',
                                description: 'QC results out of range for Glucose test',
                                time: '3 hours ago',
                                type: 'warning',
                                icon: 'exclamation',
                                color: 'text-yellow-600'
                            },
                        ].map((alert, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <svg className={`h-4 w-4 ${alert.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {alert.icon === 'exclamation' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        )}
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{alert.title}</p>
                                    <p className="text-sm text-gray-600">{alert.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
