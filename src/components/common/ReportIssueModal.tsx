'use client';

import { useState } from 'react';
import { reportProblem } from '@/lib/api';
import { useToast } from './Toast';

interface ReportIssueModalProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  relatedBookingId?: number;
  relatedPropertyId?: number;
}

const ISSUE_TYPES = [
  { value: 'BUG', label: '🐛 Bug Report' },
  { value: 'COMPLAINT', label: '😤 Complaint' },
  { value: 'SCAM_REPORT', label: '🚨 Scam Report' },
  { value: 'SUGGESTION', label: '💡 Suggestion' },
  { value: 'OTHER', label: '📝 Other' },
];

export default function ReportIssueModal({ token, isOpen, onClose, relatedBookingId, relatedPropertyId }: ReportIssueModalProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<'form' | 'submitting' | 'done'>('form');
  const [issueType, setIssueType] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
        relatedBookingId,
        relatedPropertyId,
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
        setError(response.message || 'Failed to submit report. Please try again.');
        setStep('form');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
      setStep('form');
    }
  };

  const handleClose = () => {
    setStep('form');
    setIssueType('');
    setSubject('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#1a1a2e] flex items-center gap-2">
            🚨 Report a Problem
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        {/* Done State */}
        {step === 'done' ? (
          <div className="px-6 py-10 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Report Submitted!</h3>
            <p className="text-gray-500 mb-6">
              Thank you for your report. Our support team will review it and get back to you if needed.
            </p>
            <button
              onClick={handleClose}
              className="bg-[#0071c2] hover:bg-[#005999] text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-5">
              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Issue Type <span className="text-[#cc0000]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ISSUE_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setIssueType(type.value)}
                      className={`p-3 rounded-md border text-sm font-medium transition-all ${
                        issueType === type.value
                          ? 'bg-[#ebf3ff] border-[#0071c2] text-[#0071c2]'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-[#0071c2]'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Subject <span className="text-[#cc0000]">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of the issue"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors"
                  maxLength={200}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Description <span className="text-[#cc0000]">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail (minimum 20 characters). Include any relevant information that might help us resolve it."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors min-h-[120px]"
                  maxLength={1000}
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{description.length}/1000</p>
              </div>

              {/* Related Info */}
              {(relatedBookingId || relatedPropertyId) && (
                <div className="bg-[#ebf3ff] rounded-md p-3 text-xs text-[#0071c2]">
                  <p>Attached context:</p>
                  {relatedBookingId && <p>• Booking ID: #{relatedBookingId}</p>}
                  {relatedPropertyId && <p>• Property ID: #{relatedPropertyId}</p>}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 bg-[#fff0f0] border border-[#f5c6c6] rounded-md text-sm text-[#cc0000]">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-md font-medium transition-colors"
                disabled={step === 'submitting'}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={step === 'submitting'}
                className="bg-[#0071c2] hover:bg-[#005999] text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
