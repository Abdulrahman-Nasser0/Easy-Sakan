'use client';

import { useState } from 'react';
import Link from 'next/link';
import { reportProblem } from '@/lib/api';
import { useToast } from '@/components/common/Toast';
import { useRouter } from 'next/navigation';

interface ReportIssuePageClientProps {
  token: string;
  userName: string;
  userEmail: string;
}

const ISSUE_TYPES = [
  { value: 'BUG', label: '🐛 Bug Report', desc: 'Technical issue or glitch' },
  { value: 'COMPLAINT', label: '😤 Complaint', desc: 'File a complaint about a property, landlord, or service' },
  { value: 'SCAM_REPORT', label: '🚨 Scam Report', desc: 'Report suspicious or fraudulent activity' },
  { value: 'SUGGESTION', label: '💡 Suggestion', desc: 'Share an idea for improvement' },
  { value: 'OTHER', label: '📝 Other', desc: 'Something else' },
];

export default function ReportIssuePageClient({ token, userName, userEmail }: ReportIssuePageClientProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'submitting' | 'done'>('form');
  const [issueType, setIssueType] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!issueType) {
      setError('Please select an issue type');
      return;
    }
    if (!subject.trim()) {
      setError('Please enter a subject');
      return;
    }
    if (!description.trim()) {
      setError('Please describe the issue');
      return;
    }
    if (description.trim().length < 20) {
      setError('Description must be at least 20 characters long');
      return;
    }

    setStep('submitting');
    try {
      const response = await reportProblem(token, {
        type: issueType,
        subject: subject.trim(),
        description: description.trim(),
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        },
      });

      if (response.isSuccess) {
        setStep('done');
        showToast('Issue reported successfully! Our team will review it shortly.', 'success');
      } else {
        // Show detailed error from the server
        const serverMsg = response.message || 'Failed to submit report';
        const serverErrors = response.errors?.length 
          ? response.errors.map((e: any) => typeof e === 'string' ? e : e.message || JSON.stringify(e)).join('; ')
          : '';
        setError(serverErrors ? `${serverMsg}: ${serverErrors}` : serverMsg);
        setStep('form');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
      setStep('form');
    }
  };

  const handleBackToDashboard = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="text-sky-400 hover:text-sky-300 text-sm font-medium mb-4 inline-block">
            ← Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-white">🚨 Report a Problem</h1>
          <p className="text-slate-400 mt-2">
            Found a bug or having an issue? Let us know and we&apos;ll look into it right away.
          </p>
        </div>

        {step === 'done' ? (
          /* Success State */
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-3">Report Submitted!</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Thank you for your report. Our support team will review it and get back to you if needed. We appreciate your help making Easy Sakan better!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBackToDashboard}
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                ← Back to Profile
              </button>
              <button
                onClick={() => {
                  setStep('form');
                  setIssueType('');
                  setSubject('');
                  setDescription('');
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                📝 Report Another Issue
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit}>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
              {/* User Info (read-only) */}
              <div className="bg-slate-700/30 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{userName}</p>
                  <p className="text-slate-400 text-xs">{userEmail}</p>
                </div>
                <span className="ml-auto text-xs text-slate-500">Reporting as you</span>
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  What type of issue are you experiencing? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ISSUE_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setIssueType(type.value)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        issueType === type.value
                          ? 'bg-sky-600/20 border-sky-500 ring-2 ring-sky-500/30'
                          : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <p className={`font-medium ${issueType === type.value ? 'text-sky-300' : 'text-slate-200'}`}>
                        {type.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of the issue"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors"
                  maxLength={200}
                />
                <p className="text-xs text-slate-500 mt-1 text-right">{subject.length}/200</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail (minimum 20 characters). What were you doing when it happened? What did you expect to happen? Any error messages?"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors min-h-[150px]"
                  maxLength={1000}
                  rows={5}
                />
                <p className="text-xs text-slate-500 mt-1 text-right">{description.length}/1000</p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-600/30 rounded-lg text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={step === 'submitting'}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  {step === 'submitting' ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border border-white/30 border-t-white"></span>
                      Submitting...
                    </>
                  ) : (
                    '🚨 Submit Report'
                  )}
                </button>
                <Link href="/profile" className="flex-1">
                  <button type="button" className="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Cancel
                  </button>
                </Link>
              </div>
            </div>
          </form>
        )}

        {/* Help Text */}
        {step === 'form' && (
          <div className="mt-8 bg-slate-800/30 border border-slate-700 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-3">💡 Before you submit</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Check our <Link href="/" className="text-sky-400 hover:text-sky-300">Help Center</Link> for common solutions</li>
              <li>• Include steps to reproduce the issue if it&apos;s a bug</li>
              <li>• For urgent booking issues, contact your landlord directly</li>
              <li>• We typically respond within 24 hours during business days</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
