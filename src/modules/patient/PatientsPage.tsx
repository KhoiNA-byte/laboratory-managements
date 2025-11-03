import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // State for managing patients list
  const [patients, setPatients] = useState([
    {
      mrn: 'MRN-2024-001',
      name: 'John Doe',
      age: 40,
      gender: 'male',
      phone: '+84 956 485 369',
      email: 'john.doe@email.com',
      lastVisit: '10/01/2025'
    },
    {
      mrn: 'MRN-2024-002',
      name: 'Jane Smith',
      age: 35,
      gender: 'female',
      phone: '+84 956 485 369',
      email: 'jane.smith@email.com',
      lastVisit: '08/01/2025'
    },
    {
      mrn: 'MRN-2024-003',
      name: 'Robert Johnson',
      age: 46,
      gender: 'male',
      phone: '+84 956 485 369',
      email: 'robert.j@email.com',
      lastVisit: '05/01/2025'
    },
    {
      mrn: 'MRN-2024-004',
      name: 'Emily Williams',
      age: 30,
      gender: 'female',
      phone: '+84 956 485 369',
      email: 'emily.w@email.com',
      lastVisit: '12/01/2025'
    },
    {
      mrn: 'MRN-2024-005',
      name: 'Michael Brown',
      age: 43,
      gender: 'male',
      phone: '+84 956 485 369',
      email: 'michael.b@email.com',
      lastVisit: '11/01/2025'
    },
    {
      mrn: 'MRN-2024-006',
      name: 'Sarah Davis',
      age: 36,
      gender: 'female',
      phone: '+84 956 485 369',
      email: 'sarah.d@email.com',
      lastVisit: '09/01/2025'
    }
  ])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    // Add a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])


  const handleViewDetails = (mrn: string) => {
    console.log('handleViewDetails called with MRN:', mrn)
    console.log('Navigating to:', `/admin/patients/${mrn}`)
    console.log('About to call navigate')
    // Close dropdown first, then navigate
    setOpenDropdown(null)
    // Use setTimeout to ensure dropdown closes before navigation
    setTimeout(() => {
      navigate(`/admin/patients/${mrn}`)
      console.log('Navigate called')
    }, 100)
  }

  const handleEditRecord = (mrn: string) => {
    setOpenDropdown(null)
    setTimeout(() => {
      navigate(`/admin/patients/${mrn}/edit`)
    }, 100)
  }

  const handleDeletePatient = (mrn: string) => {
    console.log('Delete patient requested for MRN:', mrn)

    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete patient ${mrn}? This action cannot be undone.`)

    if (confirmed) {
      console.log('User confirmed deletion for patient:', mrn)

      // Remove the patient from state
      setPatients(prevPatients => {
        const updatedPatients = prevPatients.filter(patient => patient.mrn !== mrn)
        console.log('Patients before deletion:', prevPatients.length)
        console.log('Patients after deletion:', updatedPatients.length)
        return updatedPatients
      })

      // Show success message
      alert(`Patient ${mrn} has been deleted successfully!`)
      console.log('Patient deleted successfully')
    } else {
      console.log('User cancelled deletion')
    }

    // Close dropdown after action
    setOpenDropdown(null)
  }

  return (
    <div className="space-y-6">
      

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Patients Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
              <p className="text-sm text-gray-500 mt-1">Active records</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* New This Month Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">New This Month</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Tests Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Tests</p>
              <p className="text-3xl font-bold text-gray-900">47</p>
              <p className="text-sm text-orange-600 mt-1">Awaiting results</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Today Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completed Today</p>
              <p className="text-3xl font-bold text-gray-900">23</p>
              <p className="text-sm text-blue-600 mt-1">Test results</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* All Patients Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">All Patients</h3>
              <p className="text-sm text-gray-600">View and manage patient medical records</p>
            </div>
          </div>

          {/* Search and Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              {/* Search Input */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search by name, email, or MRN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Test Navigation Button */}
              <button
                onClick={() => {
                  console.log('Test navigation button clicked')
                  navigate('/admin/patients/MRN-2024-001')
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test Nav
              </button>
              {/* Add Patient Button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Patient
              </button>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto overflow-y-visible">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MRN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age/Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 overflow-visible">
              {patients.map((patient) => (
                <tr key={patient.mrn} className="hover:bg-gray-50 relative">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{patient.mrn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.age} years / {patient.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{patient.phone}</div>
                      <div className="text-gray-500">{patient.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium overflow-visible">
                    <div className="relative" ref={dropdownRef} style={{ overflow: 'visible' }}>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Dropdown button clicked for patient:', patient.mrn)
                          console.log('Current openDropdown:', openDropdown)
                          setOpenDropdown(openDropdown === patient.mrn ? null : patient.mrn)
                        }}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {openDropdown === patient.mrn && (
                        <div
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                          style={{ zIndex: 9999 }}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Dropdown container clicked - preventing close')
                          }}
                        >
                          <div className="py-1">
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                console.log('View Details button clicked for patient:', patient.mrn)
                                console.log('About to call handleViewDetails')
                                handleViewDetails(patient.mrn)
                                console.log('handleViewDetails called')
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleEditRecord(patient.mrn)
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Edit Record
                            </button>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDeletePatient(patient.mrn)
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <svg className="h-4 w-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Patient
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
