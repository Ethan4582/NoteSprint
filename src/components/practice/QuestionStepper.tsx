"use client";

import { Minus, Plus } from "lucide-react";

interface QuestionStepperProps {
  label: string;
  count: number;
  available: number;
  onUpdate: (delta: number) => void;
}

export default function QuestionStepper({
  label,
  count,
  available,
  onUpdate,
}: QuestionStepperProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdate(-1)}
          className="w-8 h-8 flex items-center justify-center border border-[var(--border)] rounded-[6px] hover:bg-[var(--bg-subtle)] disabled:opacity-30"
          disabled={count <= 0}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-medium w-6 text-center">{count}</span>
        <button
          onClick={() => onUpdate(1)}
          className="w-8 h-8 flex items-center justify-center border border-[var(--border)] rounded-[6px] hover:bg-[var(--bg-subtle)] disabled:opacity-30"
          disabled={count >= available}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
