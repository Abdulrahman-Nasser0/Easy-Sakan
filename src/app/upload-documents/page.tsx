'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { getVerificationStatus, uploadVerificationDocuments } from '@/lib/api';

export default function UploadDocumentsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [missingDocs, setMissingDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const fetchStatus = async () => {
    if (!user?.token) return;
    try {
      const res = await getVerificationStatus(user.token);
      if (res.isSuccess && res.data) {
        // Fallback to check both camelCase and snake_case
        setMissingDocs(res.data.missingDocuments || res.data.missing_documents || []);
      } else {
        console.error('Failed to fetch status:', res.message);
        // Fallback to default required docs on API error to prevent false success
        setMissingDocs(['NationalID', 'UniversityID']);
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
      setMissingDocs(['NationalID', 'UniversityID']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user?.token) {
      fetchStatus();
    }
  }, [user, authLoading, router]);

  const handleUpload = async (docType: string, file: File | null) => {
    if (!file || !user?.token) return;
    
    setUploading(prev => ({ ...prev, [docType]: true }));
    try {
      const res = await uploadVerificationDocuments(user.token, docType, file);
      if (res.isSuccess) {
        alert(`${formatDocName(docType)} uploaded successfully!`);
        // Refresh status to see if there are more docs needed
        await fetchStatus();
      } else {
        alert(res.message || `Failed to upload ${formatDocName(docType)}`);
      }
    } catch (err) {
      alert('An error occurred during upload.');
    } finally {
      setUploading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const formatDocName = (doc: string) => {
    return doc.replace(/([A-Z])/g, ' $1').trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2 text-center">
          Upload Verification Documents
        </h1>
        <h2 className="text-lg text-[#1a1a2e] mb-4 text-center">
          رفع وثائق إثبات الهوية
        </h2>
        
        {missingDocs.length === 0 ? (
          <div className="text-center p-6 bg-[#ebf7eb] border border-[#c3e6c3] rounded-md mt-6">
            <p className="text-[#008009] font-medium mb-4">
              All required documents have been uploaded successfully. Awaiting Admin review.
            </p>
            <Button fullWidth onClick={() => router.push(user?.role === 'Landlord' ? '/dashboard/landlord' : '/dashboard/student')}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed">
              Please upload the following documents to verify your account and unlock features.
            </p>
            
            {missingDocs.map(doc => (
              <DocumentUploadForm 
                key={doc} 
                docType={doc} 
                isUploading={!!uploading[doc]} 
                onUpload={(file) => handleUpload(doc, file)}
                docName={formatDocName(doc)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentUploadForm({ docType, docName, isUploading, onUpload }: { docType: string, docName: string, isUploading: boolean, onUpload: (file: File | null) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onUpload(file);
      }} 
      className="p-4 border border-gray-200 rounded-md bg-gray-50 mb-4 last:mb-0"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload {docName}
        </label>
        <input 
          type="file" 
          required
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-[#ebf3ff] file:text-[#0071c2]
            hover:file:bg-[#d1e4ff] transition-colors
            border border-gray-300 bg-white rounded-md p-2"
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="flex-1" loading={isUploading} disabled={!file}>
          Submit {docName}
        </Button>
        <button 
          type="button" 
          onClick={() => router.push(user?.role === 'Landlord' ? '/dashboard/landlord' : '/')} 
          className="px-6 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium rounded-md text-sm transition-colors whitespace-nowrap"
        >
          Skip for now (تخطي مؤقتاً)
        </button>
      </div>
    </form>
  );
}
