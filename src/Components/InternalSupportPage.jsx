import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function InternalSupportPage({ work }) {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update ticket status');
      }
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  const sendToCopilot = async (ticket) => {
    try {
      const response = await fetch('http://localhost:3001/send-to-copilot', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: ticket.id,
          title: ticket.title,
          category: ticket.category,
          status: ticket.status,
          createdAt: ticket.created_at,
          description: ticket.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send ticket to Copilot');
      }

      // Update the local state to mark the ticket as sent to Copilot
      setTickets(tickets.map(t => 
        t.id === ticket.id ? { ...t, sentToCopilot: true } : t
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  const accentColor = work?.colorAccent || '#72788D';
  const fontStyle = work?.font ? { fontFamily: `"${work.font}", sans-serif` } : {};

  const filteredTickets = showResolved 
    ? tickets.filter(ticket => ticket.status === 'resolved')
    : tickets.filter(ticket => ticket.status !== 'resolved');

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8 relative" style={fontStyle}>
      <button
        onClick={() => navigate('/support')}
        className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 transition duration-300"
      >
        CU
      </button>

      <h1 className="text-4xl font-bold mb-8">{work?.brandName} Internal Support</h1>
      
      <div className="w-full max-w-4xl">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setShowResolved(false)}
            className={`px-4 py-2 rounded-md ${!showResolved ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Open Tickets
          </button>
          <button
            onClick={() => setShowResolved(true)}
            className={`px-4 py-2 rounded-md ${showResolved ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Resolved Tickets
          </button>
        </div>

        {isLoading ? (
          <div className="text-center">Loading tickets...</div>
        ) : error ? (
          <div className="text-red-500 text-center">Error: {error}</div>
        ) : filteredTickets.length === 0 ? (
          <p className="text-center">No {showResolved ? 'resolved' : 'open'} tickets found.</p>
        ) : (
          <div className="space-y-6">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">{ticket.title}</h2>
                <p className="text-gray-600 mb-1">Category: {ticket.category}</p>
                <p className="text-gray-600 mb-2">Created: {new Date(ticket.created_at).toLocaleString()}</p>
                <p className="mb-4">{ticket.description}</p>
                <div className="flex justify-between items-center">
                  {!showResolved ? (
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      className="border rounded px-2 py-1"
                      style={{ backgroundColor: accentColor, color: 'white' }}
                    >
                      <option value="new">New</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  ) : (
                    <span className="text-green-500 font-semibold">Resolved</span>
                  )}
                  {!showResolved && (
                    <button
                      onClick={() => sendToCopilot(ticket)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-300"
                      disabled={ticket.sentToCopilot}
                    >
                      {ticket.sentToCopilot ? 'Sent to Copilot' : 'Send to Copilot'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InternalSupportPage;