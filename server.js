import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5000;
const apiKey = '6321c838a26c4a11a519bb153cad0bba.5d9fe4e19342f1ff';

app.use(cors());
app.use(express.json());

// Get a specific client by ID
app.get('/api/clients/:id', async (req, res) => {
    console.log("================================================")
  const clientId = req.params.id; // Get the client ID from the URL

  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'X-API-KEY': apiKey
    }
  };

  try {
    const response = await fetch(`https://api.copilot.com/v1/clients/${clientId}`, options);
    const data = await response.json();
    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ message: 'Error fetching client data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

// Get workspaces
app.get('/api/workspaces', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }

  try {
    const response = await fetch('https://api.copilot.com/v1/workspaces', {
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workspaces from Copilot API');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
});

// Get invoices
app.get('/api/invoices', async (req, res) => {
  console.log("Fetching invoices");
  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'X-API-KEY': apiKey
    }
  };

  try {
    const response = await fetch('https://api.copilot.com/v1/invoices', options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      message: 'Error fetching invoices',
      error: error.message,
    });
  }
});

// Send message to Copilot
app.post('/api/messages', async (req, res) => {
    console.log("9999999999999")
  console.log("Sending message to Copilot");
  const { text, channelId } = req.body;

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-API-KEY': apiKey
    },
    body: JSON.stringify({ text, channelId })
  };

  try {
    const response = await fetch('https://api.copilot.com/v1/messages', options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Message sent successfully:", data);
    res.json(data);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      message: 'Error sending message',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
