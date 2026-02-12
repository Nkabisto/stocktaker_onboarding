// import { useState } from 'react'
import './App.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, RedirectToSignUp, RedirectToSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1>Dial a Stocktaker Portal</h1>
      <SignedOut>
        <button onClick={() => navigate('/sign-in')}>Login</button>
        <button onClick={() => navigate('/apply')}>Apply / Sign Up</button>
      </SignedOut>
      <SignedIn>
        <UserButton />
        {/* Redirect to dashboard after login */}
      </SignedIn>
    </div>
  );
}
export default LandingPage
