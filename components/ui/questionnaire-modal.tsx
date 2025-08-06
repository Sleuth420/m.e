'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  formUrl: string;
}

export function QuestionnaireModal({ isOpen, onClose, formUrl }: QuestionnaireModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-4xl rounded-lg bg-white shadow-lg dark:bg-slate-900">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Service Questionnaire</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <iframe
            src={formUrl}
            className="h-[600px] w-full rounded-md border"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ minHeight: '600px' }}
          />
        </div>
      </div>
    </div>
  );
}
