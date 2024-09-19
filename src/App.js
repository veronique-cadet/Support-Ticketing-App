import React, { useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Form from './Components/Form.jsx';
import TicketList from './Components/TicketList.jsx';
import SupportPage from './Components/SupportPage.jsx';
import InternalSupportPage from './Components/InternalSupportPage.jsx';

function App() {
  const [work, setWork] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/support" element={<SupportPage work={work} />} />
        <Route path="/internal-support" element={<InternalSupportPage work={work} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

