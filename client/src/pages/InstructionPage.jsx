//import "../App.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const InstructionPage = ()=>{
  const navigate = useNavigate();
  const {user } = useUser();
   
  return (
<div className="info-container max-w-5xl mx-auto px-8 py-16 bg-white font-sans">
  {/* Header - Red/White/Black theme */}
  <div className="text-center mb-20 border-b-4 border-red-600 pb-12">
    <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tight mb-8 uppercase">
      DIAL A STOCKTAKER
    </h1>
    <h2 className="text-3xl font-bold text-red-600 uppercase tracking-widest border-4 border-red-600 inline-block px-8 py-4">
      IMPORTANT INFORMATION
    </h2>
    <div className="mt-8 text-lg font-semibold text-black">
      <strong>PLEASE READ THIS!</strong>
    </div>
  </div>

  <div className="space-y-16 text-black leading-relaxed max-w-4xl mx-auto">
    
    {/* Office closure notice */}
    <div className="bg-red-50 border-4 border-red-600 p-10 rounded-lg">
      <p className="text-lg font-semibold">Your application is just the first step. Make sure you are prepared for the next stages!</p>
    </div>

    {/* Company intro */}
    <div className="bg-white border-2 border-black p-12 rounded-lg shadow-lg">
      <h3 className="text-3xl font-bold text-black mb-8 uppercase border-b-2 border-red-600 pb-6 inline-block">
        Dial a Stocktaker
      </h3>
      <p className="text-xl text-gray-800 leading-relaxed">
        Division of Dial a Student, established in 1988. We offer students and school leavers valuable work experience while earning money. Full commitment to the process is required.
      </p>
    </div>

    {/* Process Section */}
    <section>
      <h3 className="text-4xl font-bold text-black mb-12 uppercase border-b-4 border-red-600 pb-8">
        UNDERSTAND THE PROCESS
      </h3>
      
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="bg-white border-2 border-gray-300 p-10 rounded-lg hover:border-red-600 transition-all duration-300">
          <h4 className="text-2xl font-bold text-black mb-6 uppercase border-b border-gray-400 pb-4">APPLICATION</h4>
          <p className="text-lg text-gray-800">Expressing interest. Successful applications invited for Registration.</p>
        </div>

        <div className="bg-white border-2 border-gray-300 p-10 rounded-lg hover:border-red-600 transition-all duration-300 lg:col-span-2">
          <h4 className="text-2xl font-bold text-black mb-6 uppercase border-b border-gray-400 pb-4">REGISTRATION (Not Training)</h4>
          <ul className="text-lg space-y-4 text-gray-800">
            <li className="flex items-start"><span className="text-red-600 font-bold text-xl mr-4">→</span>Come to Braamfontein office</li>
            <li className="flex items-start"><span className="text-red-600 font-bold text-xl mr-4">→</span>Ask questions</li>
            <li className="flex items-start"><span className="text-red-600 font-bold text-xl mr-4">→</span>Pay R80 training materials</li>
            <li className="flex items-start"><span className="text-red-600 font-bold text-xl mr-4">→</span>Study materials before training</li>
            <li className="flex items-start text-red-600 font-bold text-xl"><span className="text-red-600 font-bold text-xl mr-4">⚠️</span><strong>DO NOT BE LATE</strong></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 bg-red-600 text-white p-12 rounded-lg">
        <h4 className="text-3xl font-bold mb-8 uppercase border-b-2 border-white pb-6 inline-block">TRAINING</h4>
        <ol className="text-xl space-y-6 list-decimal list-inside">
          <li>Apply what you studied from materials</li>
          <li>Theoretical knowledge test</li>
          <li>Practical training + test</li>
          <li><strong>Pass both → start stocktakes</strong></li>
        </ol>
      </div>
    </section>

    {/* Requirements */}
    <section className="bg-gray-50 border-4 border-red-600 p-12 rounded-lg">
      <h3 className="text-4xl font-bold text-black mb-12 uppercase text-center">REQUIREMENTS</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: '🇿🇦', title: 'South African citizen' },
          { icon: '18+', title: 'At least 18 years old' },
          { icon: 'Grade 11', title: 'Passed Grade 11' },
          { icon: '📖', title: 'Read & Write' },
          { icon: '🧮', title: 'Basic Maths' }
        ].map((req, i) => (
          <div key={i} className="text-center p-8 bg-white border border-gray-300 rounded-lg hover:border-red-600 transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{req.icon}</div>
            <h4 className="font-bold text-xl text-black mb-4 uppercase tracking-wide">{req.title}</h4>
          </div>
        ))}
      </div>
    </section>

    {/* Key Warnings */}
    <section>
      <h3 className="text-4xl font-bold text-black mb-12 uppercase border-b-4 border-red-600 pb-8">KEY WARNINGS</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div className="bg-red-50 border-4 border-red-600 p-10 rounded-lg">
          <h4 className="text-2xl font-bold text-red-600 mb-6 uppercase">NOT SIMPLE JOB APP</h4>
          <p className="text-lg text-gray-800">Mandatory registration + training required.</p>
        </div>
        
        <div className="bg-gray-50 border-4 border-black p-10 rounded-lg">
          <h4 className="text-2xl font-bold text-black mb-6 uppercase">AVAILABILITY</h4>
          <p className="text-lg text-gray-800">Weekends/after hours. Must commit.</p>
        </div>
        
        <div className="bg-white border-4 border-gray-300 p-10 rounded-lg">
          <h4 className="text-2xl font-bold text-black mb-6 uppercase">EMAIL CRITICAL</h4>
          <p className="text-lg text-gray-800">Check regularly. Respond promptly. <a href="#" className="text-red-600 font-bold hover:underline">Facebook verification</a></p>
        </div>
      </div>
    </section>

    {/* Critical Reminders */}
    <section className="bg-black text-white p-16 rounded-lg">
      <h3 className="text-4xl font-bold mb-12 uppercase text-center border-b-4 border-red-600 pb-12 max-w-2xl mx-auto">CRITICAL REMINDERS</h3>
      <div className="grid md:grid-cols-3 gap-12 text-center">
        <div>
          <div className="text-5xl font-bold text-red-600 mb-6">R80</div>
          <h4 className="text-2xl font-bold uppercase mb-4">Training Fee</h4>
          <p className="text-lg">Double it on first job</p>
        </div>
        <div>
          <div className="text-5xl mb-6">🚗</div>
          <h4 className="text-2xl font-bold uppercase mb-4">Transport x2</h4>
          <p className="text-lg">Braamfontein office visits</p>
        </div>
        <div>
          <div className="text-5xl mb-6">❌</div>
          <h4 className="text-2xl font-bold uppercase mb-4">NO SHOW = NO WORK</h4>
          <p className="text-lg font-bold">Miss registration = miss jobs</p>
        </div>
      </div>
    </section>

    {/* Footer CTA */}
    <div className="pt-20 mt-24 border-t-8 border-red-600 text-center">
      <h3 className="text-4xl font-bold text-black mb-12 uppercase">JOIN TODAY</h3>
      <p className="text-2xl text-gray-800 mb-12 max-w-3xl mx-auto leading-relaxed">
        Complete process → Nationwide stocktake opportunities. Flexible. Well-paid. <strong>Established 1988.</strong>
      </p>
      <button 
        onClick= {() => navigate('/form')}
          className="bg-red-600 text-white px-12 py-8 inline-block rounded-lg border-4 border-red-600 font-bold text-xl uppercase tracking-wide hover:bg-white hover:text-red-600 transition-all duration-300 cursor-pointer">
        Ready? Apply Now
      </button>
    </div>

  </div>
</div>
  
  );
}

export default InstructionPage;
