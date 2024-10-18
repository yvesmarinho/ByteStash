import React, { useState } from 'react';
import Modal from '../common/Modal';
import { SettingsModalProps } from '../../types/types';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [compactView, setCompactView] = useState(settings.compactView);
  const [showCodePreview, setShowCodePreview] = useState(settings.showCodePreview);
  const [previewLines, setPreviewLines] = useState(settings.previewLines);
  const [includeCodeInSearch, setIncludeCodeInSearch] = useState(settings.includeCodeInSearch);

  const handleSave = () => {
    onSettingsChange({ compactView, showCodePreview, previewLines, includeCodeInSearch });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-gray-100 mb-4">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="compactView" className="text-gray-300">Compact View</label>
          <input
            type="checkbox"
            id="compactView"
            checked={compactView}
            onChange={(e) => setCompactView(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="showCodePreview" className="text-gray-300">Show Code Preview</label>
          <input
            type="checkbox"
            id="showCodePreview"
            checked={showCodePreview}
            onChange={(e) => setShowCodePreview(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>
        {showCodePreview && (
          <div className="flex items-center justify-between">
            <label htmlFor="previewLines" className="text-gray-300">Preview Lines</label>
            <input
              type="number"
              id="previewLines"
              value={previewLines}
              onChange={(e) => setPreviewLines(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              min="1"
              max="20"
              className="form-input w-20 rounded-md bg-gray-700 border border-gray-600 text-white p-2 text-sm"
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <label htmlFor="includeCodeInSearch" className="text-gray-300">Include Code in Search Queries</label>
          <input
            type="checkbox"
            id="includeCodeInSearch"
            checked={includeCodeInSearch}
            onChange={(e) => setIncludeCodeInSearch(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="mr-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;