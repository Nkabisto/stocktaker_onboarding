import React from 'react';

export default function ApplicationButton() {
  return (
    <button 
      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      onClick={() => console.log('Application Form clicked')}
    >
      Application Form
    </button>
  );
}
