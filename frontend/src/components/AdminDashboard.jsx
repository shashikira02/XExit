import { useState, useEffect } from 'react'
import { adminAPI } from '../api/api'

function AdminDashboard({ logout }) {
  const [activeTab, setActiveTab] = useState('resignations')
  const [resignations, setResignations] = useState([])
  const [exitResponses, setExitResponses] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (activeTab === 'resignations') {
      fetchResignations()
    } else if (activeTab === 'responses') {
      fetchExitResponses()
    }
  }, [activeTab])

  const fetchResignations = async () => {
    try {
      const response = await adminAPI.getResignations()
      setResignations(response.data.data)
    } catch (error) {
      setMessage('Failed to fetch resignations')
    }
  }

  const fetchExitResponses = async () => {
    try {
      const response = await adminAPI.getExitResponses()
      setExitResponses(response.data.data)
    } catch (error) {
      setMessage('Failed to fetch exit responses')
    }
  }

  const handleConcludeResignation = async (resignationId, approved, lwd = '') => {
    try {
      await adminAPI.concludeResignation({ resignationId, approved, lwd })
      setMessage(`Resignation ${approved ? 'approved' : 'rejected'} successfully!`)
      fetchResignations()
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to conclude resignation')
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={logout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('resignations')}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: activeTab === 'resignations' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'resignations' ? 'white' : 'black',
            border: '1px solid #dee2e6'
          }}
        >
          Resignations
        </button>
        <button 
          onClick={() => setActiveTab('responses')}
          style={{ 
            padding: '10px 20px',
            backgroundColor: activeTab === 'responses' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'responses' ? 'white' : 'black',
            border: '1px solid #dee2e6'
          }}
        >
          Exit Responses
        </button>
      </div>

      {message && <div style={{ color: 'green', marginBottom: '20px' }}>{message}</div>}

      {activeTab === 'resignations' && (
        <div>
          <h3>Resignation Requests</h3>
          {resignations.length === 0 ? (
            <p>No resignation requests found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Employee</th>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Requested Date</th>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Status</th>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resignations.map((resignation) => (
                    <tr key={resignation._id}>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{resignation.employeeId}</td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                        {new Date(resignation.requestedDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{resignation.status}</td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                        {resignation.status === 'pending' && (
                          <div>
                            <input
                              type="date"
                              id={`lwd-${resignation._id}`}
                              style={{ marginRight: '10px', padding: '5px' }}
                            />
                            <button
                              onClick={() => {
                                const lwd = document.getElementById(`lwd-${resignation._id}`).value
                                handleConcludeResignation(resignation._id, true, lwd)
                              }}
                              style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', marginRight: '5px' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleConcludeResignation(resignation._id, false)}
                              style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'responses' && (
        <div>
          <h3>Exit Interview Responses</h3>
          {exitResponses.length === 0 ? (
            <p>No exit responses found.</p>
          ) : (
            exitResponses.map((response, index) => (
              <div key={index} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #dee2e6', borderRadius: '5px' }}>
                <h4>Employee ID: {response.employeeId}</h4>
                {response.responses.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '15px' }}>
                    <strong>{item.questionText}</strong>
                    <p style={{ marginTop: '5px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '3px' }}>
                      {item.response}
                    </p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard