import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

export default function SuccessPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">✓</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Application Submitted!
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Thank you, {user?.firstName}! Your stocktaker registration has been received.
        </p>

        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-lg mb-3">What happens next?</h3>
          <ul className="text-left space-y-2 text-gray-700">
            <li>✓ Our team will review your application</li>
            <li>✓ You'll receive an email within 2-3 business days</li>
            <li>✓ If approved, you'll get access to the booking dashboard</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Return Home
          </button>
          
          <button
            onClick={() => signOut()}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Sign Out
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Questions? Email us at support@stocktaker.com
        </p>
      </div>
    </div>
  );
}
