import React from 'react';

export default function AppLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-primary animate-spin" />
        <div className="text-sm text-foreground/80">Loading…</div>
      </div>
    </div>
  );
}
