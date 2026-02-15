// import { useState } from 'react'
import './App.css'
import { SignedIn, SignedOut, SignUp, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import InstructionPage from "./pages/InstructionPage" 

function App() {
  return (
    <div className="app">
      {/* Show the sign-in and sign-up buttons when the user is signed out */}
      <SignedOut>
        <div className="landing-page">
          <SignUp />
        </div>
      </SignedOut>

      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <header>
          <UserButton />
            <InstructionPage />
          {/* You can also add a redirect here */}
        </header>
      </SignedIn>
    </div>
  );
}

export default App
