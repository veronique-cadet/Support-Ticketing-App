import React, { useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Form from './Components/Form.jsx';
import TicketList from './Components/TicketList.jsx';
import SupportPage from './Components/SupportPage.jsx';
import InternalSupportPage from './Components/InternalSupportPage.jsx';

function App() {
  const [work, setWork] = useState(null);
  const clientId = '05c0bc2a-75b7-4540-b0a5-9094dbed0f43';  

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/support" element={<SupportPage work={work} clientId={clientId}/>} />
        <Route path="/internal-support" element={<InternalSupportPage work={work} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

