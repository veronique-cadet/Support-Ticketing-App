import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketForm from './TicketForm';

function SupportPage({ work }) {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const fetchWorkspaces = async () => {
    const apiKey = '6321c838a26c4a11a519bb153cad0bba.5d9fe4e19342f1ff';

    try {
      console.log('Fetching workspaces...');
      const response = await fetch('http://localhost:5000/api/workspaces', {
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error fetching workspaces');
      }
      const data = await response.json();
      console.log('Workspaces data received:', data);
      setWorkspaces(data || []);
      console.log('Workspaces state set:', data || []);
    } catch (err) {
      console.error('Error in fetchWorkspaces:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const viewTickets = () => {
    navigate('/tickets');
  };

  const accentColor = workspaces?.colorAccent || '#72788D';
  const font = workspaces?.font;

  const fontStyle = font ? { fontFamily: `"${font}", sans-serif` } : {};

  const faqs = [
    { title: "How do I reset my password?", content: "You can reset your password by..." },
    { title: "What payment methods do you accept?", content: "We accept credit cards, PayPal, and..." },
    { title: "How can I cancel my subscription?", content: "To cancel your subscription, please..." },
    { title: "Is there a mobile app available?", content: "Yes, our mobile app is available on..." },
  ];

  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    setIsAiLoading(true);
    try {
      const response = await fetch('YOUR_AI_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: aiQuestion }),
      });
      const data = await response.json();
      setAiResponse(data.answer);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAiResponse('Sorry, I couldn\'t process your question. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center bg-gray-100 p-8 relative"
      style={fontStyle}
    >
      <button
        onClick={() => navigate('/internal-support')}
        className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 transition duration-300"
      >
        IU
      </button>

      {workspaces?.squareLoginImageUrl && (
        <img 
          src={workspaces.squareLoginImageUrl} 
          alt="Support" 
          className="w-32 h-32 mb-4 object-contain"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{workspaces?.brandName} Support</h1>
      <div className="space-x-4 mb-12"> {/* Added margin-bottom here */}
        <button
          onClick={openForm}
          style={{
            backgroundColor: accentColor,
          }}
          className="text-white font-bold py-2 px-4 rounded hover:opacity-90 transition duration-300"
        >
          Message Support
        </button>
        <button
          onClick={viewTickets}
          style={{
            backgroundColor: workspaces?.colorSidebarBackground || '#ffa500',
          }}
          className="text-white font-bold py-2 px-4 rounded hover:opacity-90 transition duration-300"
        >
          View Tickets
        </button>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-4xl mt-8"> {/* Reduced margin-top here */}
        <h2 className="text-2xl font-bold mb-8 text-center">FAQs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold mb-2">{faq.title}</h3>
              <p>{faq.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="w-full max-w-4xl mt-16 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Ask AI Assistant</h2>
        <form onSubmit={handleAiSubmit} className="mb-4">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
            required
          />
          <button
            type="submit"
            style={{ backgroundColor: accentColor }}
            className="w-full text-white py-2 rounded-md hover:opacity-90 transition duration-300"
            disabled={isAiLoading}
          >
            {isAiLoading ? 'Processing...' : 'Ask AI'}
          </button>
        </form>
        {aiResponse && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-bold mb-2">AI Response:</h3>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <TicketForm onClose={closeForm} accentColor={accentColor} font={workspaces?.font} />
        </div>
      )}

      {/* Display loading state or error */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default SupportPage;