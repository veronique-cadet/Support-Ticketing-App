// src/CopilotAPI.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CopilotAPI() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const apiKey = process.env.REACT_APP_COPILOT_API_KEY; 

    axios
      .get('https://api.copilot.com/v1/endpoint', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setData(response.data);  
        setLoading(false);         
      })
      .catch((err) => {
        setError(err.message);    
        setLoading(false);        
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Data from Copilot API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default CopilotAPI;
