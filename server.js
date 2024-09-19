import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5000;
const apiKey = '6321c838a26c4a11a519bb153cad0bba.5d9fe4e19342f1ff';

app.use(cors());

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

// Send email to Copilot
app.post('/send-to-copilot', async (req, res) => {
  const { ticketId, title, category, status, createdAt, description } = req.body;

  // Create a transporter using SMTP
  let transporter = nodemailer.createTransport({
    host: "your-smtp-host",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: "your-email@example.com",
      pass: "your-email-password",
    },
  });

  // Compose the email
  let info = await transporter.sendMail({
    from: '"Support Team" <support@yourcompany.com>',
    to: "cadetvero@gmail.com",
    subject: `Support Ticket #${ticketId}: ${title}`,
    text: `
Ticket Details:
ID: ${ticketId}
Title: ${title}
Category: ${category}
Status: ${status}
Created: ${new Date(createdAt).toLocaleString()}

Description:
${description}

Please review and assist with this ticket.
    `,
  });

  console.log("Message sent: %s", info.messageId);
  res.status(200).json({ message: "Email sent successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
