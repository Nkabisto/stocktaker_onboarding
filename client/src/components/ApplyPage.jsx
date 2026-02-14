import InstructionPage from "./InstructionPage.jsx";
import ApplicationButton from "./ApplicaButton";
import { useState } from 'react';

function ApplyPage() {
  const [agreed, setAgreed] = useState(false);
  return (
    <div>
      <InstructionPage />
      <label>
        <input 
          type="checkbox" 
          checked={agreed} 
          onChange={(e) => setAgreed(e.target.checked)} 
        />
        I have read and understand the process above.
      </label>
      {agreed ? <ApplicationButton /> : <p>Please read and agree first.</p>}
    </div>
  );
}

export default ApplyPage;
