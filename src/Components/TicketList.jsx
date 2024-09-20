import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TicketList({ isInternalUser }) {
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

  const handleDelete = async (ticketId) => {
    console.log(`Attempting to delete ticket ${ticketId}`);
    try {
      const response = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      console.log('Delete response:', response.status);
      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      // Update the local state to remove the deleted ticket
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      console.log(`Ticket ${ticketId} deleted from local state`);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      setError(error.message);
    }
  };

  const handleAskForUpdate = async (ticketId) => {
    console.log(`Requesting update for ticket ${ticketId}`);
    try {
      const response = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ update_requested: true }),
      });
      console.log('Ask for update response:', response.status);
      if (!response.ok) {
        throw new Error('Failed to request update');
      }

      // Update the local state to mark the ticket as update requested
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, update_requested: true } : ticket
      ));
      console.log(`Ticket ${ticketId} marked as update requested in local state`);
    } catch (error) {
      console.error('Error in handleAskForUpdate:', error);
      setError(error.message);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    console.log(`Attempting to change status of ticket ${ticketId} to ${newStatus}`);
    try {
      const response = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      console.log('Status change response:', response.status);
      if (!response.ok) {
        throw new Error('Failed to update ticket status');
      }

      // Update the local state
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      console.log(`Ticket ${ticketId} status updated to ${newStatus} in local state`);
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      setError(error.message);
    }
  };

  const filteredTickets = showResolved 
    ? tickets.filter(ticket => ticket.status === 'resolved')
    : tickets.filter(ticket => ticket.status !== 'resolved');

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 transition duration-300"
      >
        Back
      </button>

      <h1 className="text-4xl font-bold mb-8">{isInternalUser ? 'Internal Support' : 'Your Tickets'}</h1>
      
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
                <p className="text-gray-600 mb-2">Status: {ticket.status}</p>
                <p className="mb-4">{ticket.description}</p>
                <div className="flex justify-between items-center">
                  {isInternalUser ? (
                    <>
                      {ticket.update_requested && (
                        <span className="text-yellow-500 font-semibold">Update Requested</span>
                      )}
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="new">New</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      {ticket.status !== 'resolved' && (
                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {ticket.status !== 'resolved' && (
                        <>
                          {ticket.update_requested ? (
                            <span className="text-yellow-500 font-semibold">Update Requested</span>
                          ) : (
                            <button
                              onClick={() => handleAskForUpdate(ticket.id)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-300"
                            >
                              Ask for Update
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </>
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

export default TicketList;