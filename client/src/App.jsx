import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

import InstructionPage from './pages/InstructionPage'; 
import MultiStepApplicationForm from './pages/MultiStepApplicationForm';
import SuccessPage from './pages/SuccessPage';

// Simple wrapper for routes that require login
const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut><RedirectToSignIn /></SignedOut>
  </>
);

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/sign-in/*" element={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <SignIn routing="path" path="/sign-in" />
        </div>
      } />
      
      <Route path="/sign-up/*" element={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <SignUp routing="path" path="/sign-up" />
        </div>
      } />
      
      {/* Protected Routes */}
      <Route path="/instructions" element={
        <ProtectedRoute><InstructionPage /></ProtectedRoute>
      } />
      <Route path="/form" element={
        <ProtectedRoute><MultiStepApplicationForm /></ProtectedRoute>
      } />
      <Route path="/success" element={
        <ProtectedRoute><SuccessPage /></ProtectedRoute>
      } />
      
      {/* Root Redirect Logic */}
      <Route path="/" element={
        <>
          <SignedOut><Navigate to="/sign-up" replace /></SignedOut>
          <SignedIn><Navigate to="/instructions" replace /></SignedIn>
        </>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

