import { useState } from 'react'
import { userAPI } from '../api/api'

function Dashboard({ logout }) {
  const [activeTab, setActiveTab] = useState('resign')
  const [resignationData, setResignationData] = useState({ lwd: '' })
  const [responses, setResponses] = useState([
    { questionText: 'What did you like most about working here?', response: '' },
    { questionText: 'What could be improved?', response: '' },
    { questionText: 'Would you recommend this company to others?', response: '' }
  ])
  const [message, setMessage] = useState('')

  const handleResignationSubmit = async (e) => {
    e.preventDefault()
    try {
      await userAPI.submitResignation(resignationData)
      setMessage('Resignation submitted successfully!')
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to submit resignation')
    }
  }

  const handleResponsesSubmit = async (e) => {
    e.preventDefault()
    try {
      await userAPI.submitResponses({ responses })
      setMessage('Exit responses submitted successfully!')
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to submit responses')
    }
  }

  const updateResponse = (index, value) => {
    const newResponses = [...responses]
    newResponses[index].response = value
    setResponses(newResponses)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Employee Dashboard</h2>
        <button onClick={logout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('resign')}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: activeTab === 'resign' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'resign' ? 'white' : 'black',
            border: '1px solid #dee2e6'
          }}
        >
          Submit Resignation
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
          Exit Interview
        </button>
      </div>

      {message && <div style={{ color: 'green', marginBottom: '20px' }}>{message}</div>}

      {activeTab === 'resign' && (
        <form onSubmit={handleResignationSubmit}>
          <h3>Submit Resignation</h3>
          <div style={{ marginBottom: '15px' }}>
            <label>Last Working Day:</label>
            <input
              type="date"
              value={resignationData.lwd}
              onChange={(e) => setResignationData({ lwd: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
            Submit Resignation
          </button>
        </form>
      )}

      {activeTab === 'responses' && (
        <form onSubmit={handleResponsesSubmit}>
          <h3>Exit Interview Responses</h3>
          {responses.map((item, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {item.questionText}
              </label>
              <textarea
                value={item.response}
                onChange={(e) => updateResponse(index, e.target.value)}
                required
                style={{ width: '100%', padding: '8px', minHeight: '80px' }}
              />
            </div>
          ))}
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
            Submit Responses
          </button>
        </form>
      )}
    </div>
  )
}

export default Dashboard