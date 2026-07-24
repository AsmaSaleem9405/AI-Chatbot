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

  // 1. EXPORT ONLY CHAT HISTORY AS DOCX
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Fetch chat history from your 'chat_history' table
      const { data: chatData, error: chatError } = await supabase
        .from('chat_history')
        .select('*');

      if (chatError) throw chatError;

      // Build the Word Document (.docx) structure containing only chat history
      const docChildren = [
        new Paragraph({
          text: 'Chat History Export',
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph({ text: '' }), // Spacer
        new Paragraph({
          children: [
            new TextRun({ text: 'Exported On: ', bold: true }),
            new TextRun(new Date().toLocaleString()),
          ],
        }),
        new Paragraph({ text: '' }), // Spacer
        new Paragraph({
          text: 'Conversation Records',
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
      downloadAnchor.download = `chat_history_export_${Date.now()}.docx`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(downloadUrl);

      alert('Your chat history has been successfully exported as a Word document!');
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
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-sky-50/50 to-white text-zinc-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      <main className="w-full px-6 sm:px-12 py-12 flex-grow pb-28 max-w-3xl mx-auto transition-all duration-300">
        
        {/* Header Section */}
        <div className="mb-10 transition-all duration-500 transform hover:translate-x-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
            Data Controls
          </h1>
          <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
            Manage your personal data, export chat histories securely, or clear your activity records.
          </p>
        </div>

        {/* Cards Stack */}
        <div className="space-y-4">
          
          {/* Export Card */}
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-blue-900/5 hover:border-blue-300 hover:shadow-blue-900/10 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <div className="flex items-center space-x-3 text-zinc-800 font-semibold">
                <div className="p-2.5 rounded-xl bg-blue-100/70 text-blue-600 border border-blue-200 group-hover:scale-110 transition-transform duration-300">
                  <Download className="w-5 h-5" />
                </div>
                <span>Export Chat History (Docx)</span>
              </div>
              <p className="text-sm text-zinc-500 max-w-md pl-11 sm:pl-0">
                Download a formatted Word document containing only your chat history records.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="relative z-10 w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:bg-blue-200 disabled:text-zinc-400 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
            >
              {isExporting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              <span>{isExporting ? 'Generating Doc...' : 'Export as Docx'}</span>
            </button>
          </div>

          {/* Delete Card */}
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-blue-900/5 hover:border-red-200 hover:shadow-red-900/5 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <div className="flex items-center space-x-3 text-zinc-800 font-semibold">
                <div className="p-2.5 rounded-xl bg-red-100/70 text-red-500 border border-red-200 group-hover:scale-110 transition-transform duration-300">
                  <Trash2 className="w-5 h-5" />
                </div>
                <span>Delete All Chat History</span>
              </div>
              <p className="text-sm text-zinc-500 max-w-md pl-11 sm:pl-0">
                Permanently wipe out your conversation logs from the database immediately.
              </p>
            </div>
            <button
              onClick={handleDeleteHistory}
              disabled={isDeleting}
              className="relative z-10 w-full sm:w-auto px-5 py-2.5 bg-red-50 hover:bg-red-600 active:scale-95 border border-red-200 hover:border-red-600 disabled:bg-red-50 disabled:text-red-300 text-red-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-red-600/5 flex items-center justify-center space-x-2 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin text-current" />}
              <span>{isDeleting ? 'Deleting...' : 'Clear History'}</span>
            </button>
          </div>

          {/* Privacy Standards Card */}
          <div className="bg-white/60 backdrop-blur-md border border-blue-100/80 rounded-2xl p-6 space-y-2 shadow-lg shadow-blue-900/5">
            <div className="flex items-center space-x-3 text-zinc-800 font-semibold">
              <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>Privacy & Security Standards</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed pl-11 sm:pl-0">
              Your data is encrypted securely and handled in real time with your Supabase backend.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}