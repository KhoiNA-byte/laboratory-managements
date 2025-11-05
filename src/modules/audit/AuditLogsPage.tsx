import React, { useState } from "react";

export const AuditLogsPage = () => {
  const [auditLogs] = useState([
    { id: 1, user: "admin", action: "Login", timestamp: "2024-01-15 10:30:00" },
    {
      id: 2,
      user: "user1",
      action: "Create Patient",
      timestamp: "2024-01-15 10:25:00",
    },
  ]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Audit Logs</h1>
        <button className="btn-primary">Export Logs</button>
      </div>
      <div className="page-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.timestamp}</td>
                <td>
                  <button className="btn-secondary">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
