import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TicketList({ workspaces }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const navigate = useNavigate();

  const accentColor = workspaces?.colorAccent || '#72788D';
  const sidebarColor = workspaces?.colorSidebarBackground || '#ffa500';

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
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
      setIsLoading(false);
      console.log(data);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };
   
  const handleResolve = async (id) => {
    try {
      const resolvedAt = new Date().toISOString(); // Get current date and time in ISO format
      const response = await fetch(`http://localhost:3001/tickets/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'resolved',
          resolved_at: resolvedAt
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }
      
      const updatedTicket = await response.json();
      console.log('Server response:', updatedTicket);

      if (updatedTicket.status === 'resolved') {
        setTickets(prevTickets => 
          prevTickets.map(ticket => 
            ticket.id === id ? updatedTicket : ticket
          )
        );
        console.log('Ticket resolved successfully');
      } else {
        console.error('Server did not update the ticket status');
      }
    } catch (err) {
      console.error('Error resolving ticket:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Your Tickets</h1>
      
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div className="space-x-4">
            <button
              onClick={() => setShowResolved(false)}
              style={{
                backgroundColor: !showResolved ? accentColor : 'transparent',
                color: !showResolved ? 'white' : accentColor,
                border: `2px solid ${accentColor}`
              }}
              className="py-2 px-4 rounded font-bold transition duration-300"
            >
              Open Tickets
            </button>
            <button
              onClick={() => setShowResolved(true)}
              style={{
                backgroundColor: showResolved ? accentColor : 'transparent',
                color: showResolved ? 'white' : accentColor,
                border: `2px solid ${accentColor}`
              }}
              className="py-2 px-4 rounded font-bold transition duration-300"
            >
              Resolved Tickets
            </button>
          </div>
          <button
            onClick={handleGoBack}
            style={{ backgroundColor: sidebarColor }}
            className="text-white font-bold py-2 px-4 rounded transition duration-300 hover:opacity-90"
          >
            Go Back
          </button>
        </div>

        {isLoading ? (
          <div className="text-center">Loading tickets...</div>
        ) : error ? (
          <div className="text-red-500 text-center">Error: {error}</div>
        ) : (showResolved ? tickets.filter(ticket => ticket.status === 'resolved') : tickets.filter(ticket => ticket.status !== 'resolved')).length === 0 ? (
          <p className="text-center text-lg font-medium">
            {showResolved ? "No resolved tickets found." : "No open tickets found."}
          </p>
        ) : (
          <div className="space-y-6">
            {(showResolved ? tickets.filter(ticket => ticket.status === 'resolved') : tickets.filter(ticket => ticket.status !== 'resolved')).map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">{ticket.title}</h2>
                <p className="text-gray-600 mb-1">Category: {ticket.category}</p>
                <p className="text-gray-600 mb-1">Status: {ticket.status}</p>
                <p className="text-gray-600 mb-2">Created: {new Date(ticket.created_at).toLocaleString()}</p>
                <p className="mb-4">{ticket.description}</p>
                {!showResolved && (
                  <button
                    onClick={() => handleResolve(ticket.id)}
                    style={{ backgroundColor: accentColor }}
                    className="text-white font-bold py-2 px-4 rounded transition duration-300 hover:opacity-90"
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketList;