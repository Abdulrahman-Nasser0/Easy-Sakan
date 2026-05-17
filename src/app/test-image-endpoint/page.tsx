'use client';

import { useState } from 'react';
import { testImageUploadEndpoint } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function TestImageEndpoint() {
  const { user } = useAuth();
  const [propertyId, setPropertyId] = useState('8');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    if (!user?.token) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const testResult = await testImageUploadEndpoint(user.token, parseInt(propertyId));
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Image Upload Endpoint Tester</h1>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Property ID</label>
            <input
              type="number"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Token Status</label>
            <div className={`p-3 rounded ${user?.token ? 'bg-green-900/30 border border-green-600' : 'bg-red-900/30 border border-red-600'}`}>
              {user?.token ? (
                <span className="text-green-400">✅ Authenticated - Ready to test</span>
              ) : (
                <span className="text-red-400">❌ Not authenticated - Please login first</span>
              )}
            </div>
          </div>

          <button
            onClick={handleTest}
            disabled={loading || !user?.token}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded font-medium transition-colors"
          >
            {loading ? '⏳ Testing...' : '🧪 Test Image Upload Endpoint'}
          </button>
        </div>

        {result && (
          <div className={`bg-slate-800 border rounded-lg p-6 ${result.success ? 'border-green-600' : 'border-red-600'}`}>
            <h2 className={`text-xl font-bold mb-4 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.success ? '✅ Test Passed' : '❌ Test Failed'}
            </h2>

            <div className="space-y-3 text-sm font-mono bg-slate-900 p-4 rounded border border-slate-700 overflow-auto max-h-96">
              <div>
                <span className="text-slate-400">Status Code:</span>
                <span className="ml-2">{result.statusCode || 'N/A'}</span>
              </div>
              {result.statusText && (
                <div>
                  <span className="text-slate-400">Status Text:</span>
                  <span className="ml-2">{result.statusText}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400">Message:</span>
                <span className="ml-2">{result.message || result.error || 'N/A'}</span>
              </div>
              {result.body && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <span className="text-slate-400">Response:</span>
                  <pre className="mt-2 text-xs whitespace-pre-wrap wrap-break-word">
                    {typeof result.body === 'string'
                      ? result.body.substring(0, 500)
                      : JSON.stringify(result.body, null, 2).substring(0, 500)}
                  </pre>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-4">
              💡 Check browser console (F12) for detailed logs from the diagnostic function
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
