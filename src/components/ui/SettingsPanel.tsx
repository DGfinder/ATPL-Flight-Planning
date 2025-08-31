import React, { useState, useEffect } from 'react';
import type { StudyMode } from '../../types';
import { storageService } from '../../utils/localStorage';
import type { StorageSettings } from '../../utils/localStorage';

interface SettingsPanelProps {
  onClose: () => void;
  currentStudyMode: StudyMode;
  onStudyModeChange: (mode: StudyMode) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
  currentStudyMode,
  onStudyModeChange
}) => {
  const [settings, setSettings] = useState<StorageSettings>(storageService.loadSettings());

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      preferredStudyMode: currentStudyMode
    }));
  }, [currentStudyMode]);

  const updateSetting = <K extends keyof StorageSettings>(
    key: K, 
    value: StorageSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    
    if (key === 'preferredStudyMode') {
      onStudyModeChange(value as StudyMode);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults? This action cannot be undone.')) {
      const defaultSettings: StorageSettings = {
        preferredStudyMode: 'practice',
        showWorkingSteps: true,
        autoAdvanceOnCorrect: false
      };
      setSettings(defaultSettings);
      storageService.saveSettings(defaultSettings);
      onStudyModeChange('practice');
    }
  };

  const handleClearData = () => {
    if (confirm('Clear all study data including progress and answers? This action cannot be undone.')) {
      storageService.clearAllData();
      onClose();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="aviation-card max-w-2xl p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-aviation-primary">Study Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Study Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Study Mode
                </label>
                <select
                  value={settings.preferredStudyMode}
                  onChange={(e) => updateSetting('preferredStudyMode', e.target.value as StudyMode)}
                  className="aviation-input w-full"
                >
                  <option value="practice">Practice Mode (Immediate Feedback)</option>
                  <option value="exam">Exam Mode (Feedback at End)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Practice mode shows correct answers immediately. Exam mode waits until you finish.
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showWorkingSteps"
                  checked={settings.showWorkingSteps}
                  onChange={(e) => updateSetting('showWorkingSteps', e.target.checked)}
                  className="mr-3"
                />
                <label htmlFor="showWorkingSteps" className="text-sm text-gray-700">
                  Show working steps by default
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoAdvance"
                  checked={settings.autoAdvanceOnCorrect}
                  onChange={(e) => updateSetting('autoAdvanceOnCorrect', e.target.checked)}
                  className="mr-3"
                />
                <label htmlFor="autoAdvance" className="text-sm text-gray-700">
                  Auto-advance to next question when correct (Practice mode only)
                </label>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Data Management</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  const data = storageService.exportData();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `atpl-study-data-${Date.now()}.json`;
                  a.click();
                }}
                className="aviation-button-secondary w-full"
              >
                Export Study Data
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2 px-4 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Reset Settings to Default
              </button>

              <button
                onClick={handleClearData}
                className="w-full py-2 px-4 text-sm text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors"
              >
                Clear All Study Data
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button 
            onClick={onClose}
            className="aviation-button"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;