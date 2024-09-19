import React, { useState, useEffect } from 'react';

function ClientInfo() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace this with how you store the auth token in localStorage or state
    const token = localStorage.getItem('authToken');

    fetch('http://localhost:5000/api/clients', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Use authorization token if needed
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
        setClient(data); // Set the client info
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading client info...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Client Information</h2>
      <p>{client.givenName} {client.familyName}</p>
      <p>Email: {client.email}</p>
    </div>
  );
}

export default ClientInfo;
