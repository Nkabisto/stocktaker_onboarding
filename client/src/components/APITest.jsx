import {useEffect, useState} from 'react'
import axios from 'axios';

export default function APITest(){
    const [apiStatus, setApiStatus] = useState('Checking...');
    const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    // Test basic API endpoint
    axios.get('/api/test')
      .then(response => {
        setApiStatus(`✅ ${response.data.message}`);
      })
      .catch(error => {
        setApiStatus(`❌ Failed to connect: ${error.message}`);
      });

    // Add health check
    axios.get('/api/health')
      .then(response =>{
        setHealthStatus(`✅ ${response.data.status}`);
    })
    .catch(error => {
      setHealthStatus(`❌ Failed: ${error.message}`);
    });
  },[]);

  return(
    <div style={{ padding: '20px', border: '1px solid #cc', borderRadius: '8px' }}>
      <h3>Backend Connection Test </h3>
      <p><strong>API Test:</strong>{ apiStatus }</p>
      <p><strong>Health Check:</strong> {healthStatus}</p>
      <p><strong>Backend URL:</strong> {import.meta.env.VITE_API_URL}</p>
    </div>
  );
}
