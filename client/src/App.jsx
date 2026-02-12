import { useState } from 'react'
import './App.css'
import APITest from './components/APITest'

export default function App(){
  const [count, setCount] = useState(0);

  return(
    <>
      <div>
        <h1>{import.meta.env.VITE_APP_NAME}</h1>
        <div className="card">
        <button onClick={()=> setCount((count)=> count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <APITest />
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  </>
  ) 
};


