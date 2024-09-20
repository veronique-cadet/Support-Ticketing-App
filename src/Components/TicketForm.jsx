import React, { useState, useEffect } from 'react';

function TicketForm({ onClose, accentColor, font, onClientIdAvailable }) {
  const [clientInfo, setClientInfo] = useState(null);
  const [ticketDetails, setTicketDetails] = useState({ 
    description: '', 
    category: '',
    invoiceId: '', // New field for selected invoice
    confirmedSteps: false // New field for confirming troubleshooting steps
  });
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clientId = '05c0bc2a-75b7-4540-b0a5-9094dbed0f43';  

  useEffect(() => {
    fetchClientInfo();
    if (ticketDetails.category === 'refund') {
      fetchInvoices();
    }
  }, [clientId, ticketDetails.category]);

  const fetchClientInfo = async () => {
    setIsLoading(true);
    fetch(`http://localhost:5000/api/clients/${clientId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching client info');
        }
        return response.json();
      })
      .then((data) => {
        setClientInfo(data);
        setIsLoading(false);
        console.log(data);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error fetching invoices');
      }
      const data = await response.json();
      setInvoices(data.data || []); // Assuming the response has a 'data' property containing the invoices
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3001/tickets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        description: ticketDetails.description,
        category: ticketDetails.category,
        client_id: clientId,
        status: "New Ticket",
        invoice_id: ticketDetails.invoiceId, // Include invoice ID if applicable
        confirmed_steps: ticketDetails.confirmedSteps // Include confirmed steps if applicable
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Ticket created:', data);
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Failed to submit ticket. Please try again.');
      });
  };

  const fontStyle = font ? { fontFamily: `"${font}", sans-serif` } : {};

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md relative flex items-center justify-center h-64" style={fontStyle}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md relative" style={fontStyle}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        X
      </button>
      
      {isSubmitted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ticket Submitted</h2>
          <p>Your ticket has been submitted. Returning to main page...</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Hi {clientInfo?.givenName}! How can we help you today?
          </h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Category</label>
              <select
                value={ticketDetails.category}
                onChange={(e) => setTicketDetails({ ...ticketDetails, category: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                <option value="refund">Refund</option>
                <option value="faq">FAQ</option>
                <option value="technical">Technical Issue</option>
              </select>
            </div>
            {ticketDetails.category === 'refund' && (
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Invoice</label>
                <select
                  value={ticketDetails.invoiceId}
                  onChange={(e) => setTicketDetails({ ...ticketDetails, invoiceId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select an invoice</option>
                  {invoices
                    .filter(invoice => invoice.recipientId === clientId)
                    .map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.number} - ${invoice.total} 
                      </option>
                    ))}
                </select>
              </div>
            )}
            {ticketDetails.category === 'faq' && (
              <div className="mb-4">
                <p className="text-gray-700 mb-2">Have you looked at our FAQ or asked our AI?</p>
                <button
                  onClick={onClose}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                >
                  Go Back to Main Page
                </button>
              </div>
            )}
            {ticketDetails.category === 'technical' && (
              <div className="mb-4">
                <p className="text-gray-700 mb-2">Can you please try the following in the specific order:</p>
                <ul className="list-disc list-inside text-gray-700 mb-2">
                  <li>Refresh your window</li>
                  <li>Clear cache and cookies</li>
                  <li>Turn off any extensions you have</li>
                  <li>Try using your portal in an incognito window</li>
                </ul>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={ticketDetails.confirmedSteps}
                    onChange={(e) => setTicketDetails({ ...ticketDetails, confirmedSteps: e.target.checked })}
                    className="mr-2"
                    required
                  />
                  <label className="text-gray-700">I have tried the above steps</label>
                </div>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Description</label>
              <textarea
                value={ticketDetails.description}
                onChange={(e) => setTicketDetails({ ...ticketDetails, description: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              style={{ backgroundColor: accentColor }}
              className="w-full text-white py-2 rounded-md hover:opacity-90 transition duration-300"
            >
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default TicketForm;
