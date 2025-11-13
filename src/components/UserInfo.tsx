// import React from 'react'
// import { useSelector } from 'react-redux'
// import { RootState } from '../../store'

// export const UserInfo = () => {
//     const user = useSelector((state: RootState) => state.auth.user)
//     const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

//     if (!isAuthenticated || !user) {
//         return null
//     }

//     return (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//             <h3 className="font-semibold text-blue-800 mb-2">Current User Info:</h3>
//             <p><strong>Name:</strong> {user.name || user.username}</p>
//             <p><strong>Email:</strong> {user.email}</p>
//             <p><strong>Role:</strong> {user.role}</p>
//             <p><strong>ID:</strong> {user.id}</p>
//         </div>
//     )
// }
