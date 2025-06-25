import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './components/Auth';
import CreatePoll from './components/CreatePoll';
import MyPolls from './components/MyPolls';
import EditPoll from './components/EditPoll';
function App(){
  return(
    <Router>
      <Routes>
        
        <Route path="/"element={<Auth/>}/>
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/mypolls" element={<MyPolls />} />
        <Route path="/editpolls/:id" element={<EditPoll/>}/>
      </Routes>
    </Router>
  )
}
export default App;