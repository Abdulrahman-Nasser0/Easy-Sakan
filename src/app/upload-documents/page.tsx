'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { getVerificationStatus, uploadVerificationDocuments } from '@/lib/api';

export default function UploadDocumentsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAdmin, isLandlord } = useAuth();

  const [missingDocs, setMissingDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});

  const defaultDocs = isLandlord ? ['NationalID'] : ['NationalID', 'UniversityID'];
  const dashboardPath = isLandlord ? '/dashboard/landlord' : '/dashboard/student';

  const fetchStatus = async () => {
    if (!user?.token) return;
    try {
      const res = await getVerificationStatus(user.token);
      if (res.isSuccess && res.data) {
        const docs: string[] = res.data.missingDocuments || res.data.missing_documents || [];
        // Landlords only need NationalID, not UniversityID
        setMissingDocs(isLandlord ? docs.filter(d => d !== 'UniversityID') : docs);
      } else {
        setMissingDocs(defaultDocs);
      }
    } catch {
      setMissingDocs(defaultDocs);
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

    // Admins are always verified — redirect away from this page
    if (isAdmin) {
      router.push('/admin');
      return;
    }

    fetchStatus();
  }, [user, authLoading, isAdmin]);

  const handleUpload = async (docType: string, file: File | null) => {
    if (!file || !user?.token) return;

    setUploading(prev => ({ ...prev, [docType]: true }));
    setDocErrors(prev => ({ ...prev, [docType]: '' }));

    try {
      const res = await uploadVerificationDocuments(user.token, docType, file);
      if (res.isSuccess) {
        await fetchStatus();
      } else {
        setDocErrors(prev => ({ ...prev, [docType]: res.message || `Failed to upload ${formatDocName(docType)}.` }));
      }
    } catch {
      setDocErrors(prev => ({ ...prev, [docType]: 'An error occurred during upload. Please try again.' }));
    } finally {
      setUploading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const formatDocName = (doc: string) => doc.replace(/([A-Z])/g, ' $1').trim();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2 text-center">
          Verify Your Account
        </h1>

        {missingDocs.length === 0 ? (
          <div className="text-center p-6 bg-[#ebf7eb] border border-[#c3e6c3] rounded-md mt-6">
            <svg className="w-12 h-12 text-[#008009] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#008009] font-semibold text-lg mb-1">Documents Submitted</p>
            <p className="text-gray-600 text-sm mb-4">
              Your documents are under review. You will be notified once your account is verified.
            </p>
            <Button fullWidth onClick={() => router.push(dashboardPath)}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-gray-600 text-sm text-center leading-relaxed mb-6">
              Upload the following document{missingDocs.length > 1 ? 's' : ''} to unlock all features.
            </p>
            <div className="space-y-4">
              {missingDocs.map(doc => (
                <DocumentUploadForm
                  key={doc}
                  docName={formatDocName(doc)}
                  isUploading={!!uploading[doc]}
                  error={docErrors[doc]}
                  onUpload={(file) => handleUpload(doc, file)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentUploadForm({
  docName,
  isUploading,
  error,
  onUpload,
}: {
  docName: string;
  isUploading: boolean;
  error?: string;
  onUpload: (file: File | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onUpload(file); }}
      className="p-4 border border-gray-200 rounded-md bg-gray-50"
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {docName}
      </label>
      <input
        type="file"
        required
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#ebf3ff] file:text-[#0071c2] hover:file:bg-[#d1e4ff] transition-colors border border-gray-300 bg-white rounded-md p-2 mb-3"
      />
      {error && (
        <p className="text-[#cc0000] text-sm mb-3 bg-[#fff0f0] border border-[#f5c6c6] rounded px-3 py-2">
          {error}
        </p>
      )}
      <Button type="submit" fullWidth loading={isUploading} disabled={!file}>
        Upload {docName}
      </Button>
    </form>
  );
}
