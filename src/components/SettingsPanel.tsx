import { Volume2, VolumeX, RotateCcw, X } from 'lucide-react';
import type { ReactNode } from 'react';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
}

export function SettingsPanel({
  open,
  onClose,
  soundEnabled,
  onToggleSound,
  onResetProgress,
}: SettingsPanelProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 animate-slide-in">
        <div className="bg-white rounded-t-3xl shadow-2xl p-6 safe-bottom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl text-gray-800">Settings</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <SettingsRow
              icon={soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              label="Sound Effects"
              active={soundEnabled}
              onToggle={onToggleSound}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => {
                if (confirm('Reset all progress? This will clear your best score, streak, and daily challenge progress.')) {
                  onResetProgress();
                  onClose();
                }
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-error-500 hover:bg-error-50 transition-colors font-semibold"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function SettingsRow({
  icon,
  label,
  active,
  onToggle,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50">
      <div className="flex items-center gap-3 text-gray-700">
        <span className="text-gray-400">{icon}</span>
        <span className="font-semibold">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
          active ? 'bg-success-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
            active ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}
