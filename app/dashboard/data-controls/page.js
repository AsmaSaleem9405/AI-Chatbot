'use client';
import React, { useState } from 'react';
import { Download, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DataControlsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. EXPORT PROFILE AND CHAT HISTORY AS DOCX
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Fetch profile data from your 'profiles' table in Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      // Fetch chat history from your 'chat_history' table
      const { data: chatData, error: chatError } = await supabase
        .from('chat_history')
        .select('*');

      if (chatError) throw chatError;

      // Extract user details dynamically from the 'profiles' table row
      // (Modify column names here if your table uses something specific like 'first_name')
      const profileName = profileData?.full_name || profileData?.name || profileData?.username || 'Valued User';
      const profileEmail = profileData?.email || 'N/A';
      const additionalInfo = profileData?.bio || profileData?.role || '';

      // Build the Word Document (.docx) structure
      const docChildren = [
        new Paragraph({
          text: 'User Account & Chat History Export',
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph({ text: '' }), // Spacer
        
        // Profile Section Heading
        new Paragraph({
          text: 'Profile Information',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Name: ', bold: true }),
            new TextRun(profileName),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Email: ', bold: true }),
            new TextRun(profileEmail),
          ],
        }),
        ...(additionalInfo ? [
          new Paragraph({
            children: [
              new TextRun({ text: 'Details: ', bold: true }),
              new TextRun(additionalInfo),
            ],
          })
        ] : []),
        new Paragraph({
          children: [
            new TextRun({ text: 'Exported On: ', bold: true }),
            new TextRun(new Date().toLocaleString()),
          ],
        }),
        new Paragraph({ text: '' }), // Spacer

        // Chat History Section Heading
        new Paragraph({
          text: 'Chat History Records',
          heading: HeadingLevel.HEADING_1,
        }),
      ];

      if (!chatData || chatData.length === 0) {
        docChildren.push(
          new Paragraph({
            text: 'No chat history found.',
            italics: true,
          })
        );
      } else {
        chatData.forEach((row, index) => {
          const timestamp = row.created_at ? new Date(row.created_at).toLocaleString() : 'Unknown time';
          const sender = row.role || row.sender || 'User';
          const messageText = row.message || row.content || JSON.stringify(row);

          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: `[${index + 1}] ${sender.toUpperCase()} (${timestamp})\n`, bold: true, color: '4F46E5' }),
                new TextRun({ text: messageText }),
              ],
            }),
            new Paragraph({ text: '' }) // Space between messages
          );
        });
      }

      // Create the document blob
      const doc = new Document({
        sections: [{ properties: {}, children: docChildren }],
      });

      const blob = await Packer.toBlob(doc);

      // Trigger browser download
      const downloadUrl = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = downloadUrl;
      downloadAnchor.download = `user_data_export_${Date.now()}.docx`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(downloadUrl);

      alert('Your profile and chat history have been successfully exported as a Word document!');
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export data. Please check your database connection.');
    } finally {
      setIsExporting(false);
    }
  };

  // 2. REAL-TIME DELETE CHAT HISTORY
  const handleDeleteHistory = async () => {
    const confirmed = window.confirm('Are you sure you want to delete all your chat history? This action cannot be undone.');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .not('id', 'is', null);

      if (error) {
        console.error('Supabase Delete Error Details:', error);
        alert(`Failed to delete history: ${error.message || JSON.stringify(error)}`);
        return;
      }

      alert('All chat history has been permanently deleted in real time.');
    } catch (err) {
      console.error('Catch error:', err);
      alert('An unexpected error occurred while deleting history.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-white text-zinc-900 flex flex-col">
      <main className="w-full px-6 sm:px-12 py-10 flex-grow pb-28 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
            Data Controls
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your personal data, export chat histories, or clear your activity records.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-50/80 border border-zinc-200/60 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-zinc-800 font-medium">
                <Download className="w-5 h-5 text-indigo-600" />
                <span>Export Account Data (Docx)</span>
              </div>
              <p className="text-sm text-zinc-500 max-w-md">
                Download a formatted Word document containing your profile information and full chat history.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="px-4 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-100 disabled:bg-zinc-50 text-zinc-800 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center space-x-2 whitespace-nowrap"
            >
              {isExporting && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
              <span>{isExporting ? 'Generating Doc...' : 'Export as Docx'}</span>
            </button>
          </div>

          <div className="bg-zinc-50/80 border border-zinc-200/60 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-zinc-800 font-medium">
                <Trash2 className="w-5 h-5 text-red-500" />
                <span>Delete All Chat History</span>
              </div>
              <p className="text-sm text-zinc-500 max-w-md">
                Permanently wipe out your conversation logs from the database immediately.
              </p>
            </div>
            <button
              onClick={handleDeleteHistory}
              disabled={isDeleting}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 disabled:bg-red-50/50 text-red-600 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center space-x-2 whitespace-nowrap"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin text-red-600" />}
              <span>{isDeleting ? 'Deleting...' : 'Clear History'}</span>
            </button>
          </div>

          <div className="bg-zinc-50/80 border border-zinc-200/60 rounded-2xl p-6 space-y-3">
            <div className="flex items-center space-x-2 text-zinc-800 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Privacy & Security Standards</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Your data is encrypted securely and handled in real time with your Supabase backend.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}