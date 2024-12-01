import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Button } from '@/components/ui/button';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import StatefulLoginForm from '@/components/StatefulLoginForm';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './Dashboard';
import './App.css'
import MessagingWidget from './components/MessagingWidget';
import { AuthProvider } from './context/AuthContext';



const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
