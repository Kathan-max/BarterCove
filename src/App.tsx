import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/LoginForm';
import StatefulLoginForm from '@/components/StatefulLoginForm';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './Dashboard';
import './App.css'
import MessagingWidget from './components/MessagingWidget';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StatefulLoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  </Router>
  );
};

export default App
