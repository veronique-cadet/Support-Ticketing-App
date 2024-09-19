// const express = require('express');
// const fetch = require('node-fetch');
// const cors = require('cors');
// require('dotenv').config(); // Add this line

// const app = express();
// const PORT = process.env.PORT || 5000;
// const apiKey = process.env.API_KEY; // Use environment variable

// // Apply CORS to all routes
// app.use(cors());

// app.get('/api/clients', async (req, res) => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'accept': 'application/json',
//       'X-API-KEY': apiKey
//     }
//   };

//   try {
//     const response = await fetch('https://api.copilot.com/v1/clients?limit=100', options);
//     const data = await response.json();
//     res.status(200).json(data);
//   } catch (error) {
//     console.error('Error fetching clients data:', error);
//     res.status(500).json({ message: 'Error fetching clients data', error: error.toString() });
//   }
// });

// // app.get('/api/workspaces', async (req, res) => {
// //   const options = {
// //     method: 'GET',
// //     headers: {
// //       'accept': 'application/json',
// //       'X-API-KEY': apiKey
// //     }
// //   };

// //   try {
// //     const response = await fetch('https://api.copilot.com/v1/workspaces', options);
// //     const data = await response.json();
// //     if (response.ok) {
// //       res.json(data);
// //     } else {
// //       throw new Error(`API call failed with status: ${response.status}`);
// //     }
// //   } catch (error) {
// //     console.error('Server error while fetching workspaces:', error);
// //     res.status(500).json({ message: 'Error fetching workspace data', error: error.toString() });
// //   }
// // });
// app.get('/api/workspaces', async (req, res) => {
//   if (!apiKey) {
//     return res.status(500).json({ message: 'API key is not set' });
//   }

//   const options = {
//     method: 'GET',
//     headers: {
//       'accept': 'application/json',
//       'X-API-KEY': apiKey
//     }
//   };

//   try {
//     const response = await fetch('https://api.copilot.com/v1/workspaces/', options);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching workspaces:', error);
//     res.status(error.response?.status || 500).json({ 
//       message: 'Error fetching workspace data', 
//       error: error.message 
//     });
//   }
// });

// // Proxy route for List Invoices
// app.get('/api/invoices', async (req, res) => {
//   try {
//     const response = await fetch('https://api.copilot.com/v1/invoices', {
//       headers: {
//         'Authorization': `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching invoices:', error.message);
//     res.status(500).json({
//       message: 'Error fetching invoices',
//       error: error.message,
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
