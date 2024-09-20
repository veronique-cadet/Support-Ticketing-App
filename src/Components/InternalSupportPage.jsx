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

      // Send a message based on the new status
      if (newStatus === 'resolved' || newStatus === 'pending') {
        await sendStatusChangeMessage(ticketId, newStatus);
      }
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      setError(error.message);
    }
  };

  const sendStatusChangeMessage = async (ticketId, status) => {
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      let message;
      if (status === 'resolved') {
        message = "This ticket has been resolved. Thank you for being an amazing human being!";
      } else if (status === 'pending') {
        message = "Your ticket status has been updated to pending. We're working on it!";
      } else {
        throw new Error('Invalid status for sending message');
      }

      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API-KEY': '6321c838a26c4a11a519bb153cad0bba.5d9fe4e19342f1ff'
        },
        body: JSON.stringify({
          text: message,
          channelId: 'o6zm4eawj1p7vfa656tv' // Make sure this is the correct channel ID for your use case
        })
      };

      const response = await fetch('http://localhost:5000/api/messages', options);
      
      if (!response.ok) {
        throw new Error(`Failed to send ${status} message`);
      }

      const responseData = await response.json();
      console.log(`${status.charAt(0).toUpperCase() + status.slice(1)} message sent for ticket ${ticketId}:`, responseData);
    } catch (error) {
      console.error(`Error sending ${status} message:`, error);
      // Optionally, you can set an error state or show an alert here
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

  const handleContactCopilotSupport = async (ticket) => {
    try {
      const response = await fetch('http://localhost:5000/api/contact-copilot-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          ticketId: ticket.id,
          clientInfo: ticket.client, // Assuming the ticket object has client information
          ticketInfo: {
            title: ticket.title,
            category: ticket.category,
            status: ticket.status,
            description: ticket.description,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to contact Copilot Support');
      }

      alert('Copilot Support has been contacted successfully!');
    } catch (error) {
      console.error('Error contacting Copilot Support:', error);
      alert('Failed to contact Copilot Support. Please try again.');
    }
  };

  const filteredTickets = showResolved 
    ? tickets.filter(ticket => ticket.status === 'resolved')
    : tickets.filter(ticket => ticket.status !== 'resolved');

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
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
              <div key={ticket.id} className="bg-white rounded-lg shadow-md p-6 relative">
                {ticket.status !== 'resolved' && (
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition duration-300"
                  >
                    ✕
                  </button>
                )}
                <h2 className="text-xl font-semibold mb-2">{ticket.title}</h2>
                <p className="text-gray-600 mb-1">Category: {ticket.category}</p>
                <p className="text-gray-600 mb-2">Created: {new Date(ticket.created_at).toLocaleString()}</p>
                <p className="text-gray-600 mb-2">Status: {ticket.status}</p>
                {ticket.category === 'technical issue' && (
                  <p className="text-green-500 font-semibold mb-2">Troubleshoot steps taken?: Yes</p>
                )}
                {ticket.update_requested && (
                  <p className="text-yellow-500 font-semibold mb-2">Update Requested</p>
                )}
                <p className="mb-4">{ticket.description}</p>
                {ticket.status !== 'resolved' ? (
                  <div className="flex justify-between items-center">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="new">New</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button
                      onClick={() => handleContactCopilotSupport(ticket)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Contact Copilot Support
                    </button>
                  </div>
                ) : (
                  <p className="absolute bottom-2 right-2 text-green-500 font-semibold">Resolved</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InternalSupportPage;