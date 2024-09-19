
import React, { useState, useEffect } from 'react';

function CopilotAPI() {
  const [clientsData, setClientsData] = useState({ data: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/clients')  
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(responseData => {
        console.log('Received data:', responseData);
        setClientsData(responseData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>List of Clients</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : clientsData.data && clientsData.data.length > 0 ? (
        <ul>
          {clientsData.data.map((client) => (
            <li key={client.id}>
              {client.givenName} {client.familyName} - {client.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No clients data available</p>
      )}
    </div>
  );
}

export default CopilotAPI;
