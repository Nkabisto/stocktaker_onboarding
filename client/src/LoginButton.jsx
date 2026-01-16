import React from 'react';

export default function LoginButton() {
  return (
    <button 
      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      onClick={() => console.log('Login clicked')}
    >
      Login
    </button>
  );
}
