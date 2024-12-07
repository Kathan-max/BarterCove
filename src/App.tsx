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
import UserProfile from './components/UserProfile';
import ProductCreationForm from './components/ProductCreation';
import { useAuth } from './context/AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-profile/:firebaseUid" element={<UserProfile />} />
          <Route path="/create-product" element={<ProductCreationForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
