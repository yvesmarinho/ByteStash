import React, { useState } from 'react';
import Modal from '../common/Modal';
import { SettingsModalProps } from '../../types/types';
import { BookOpen } from 'lucide-react';

const GITHUB_URL = "https://github.com/jordan-dalby/ByteStash";
const DOCKER_URL = "https://github.com/jordan-dalby/ByteStash/pkgs/container/bytestash";
const REDDIT_URL = "https://www.reddit.com/r/selfhosted/comments/1gb1ail/selfhosted_code_snippet_manager/";
const WIKI_URL = "https://github.com/jordan-dalby/ByteStash/wiki";

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [compactView, setCompactView] = useState(settings.compactView);
  const [showCodePreview, setShowCodePreview] = useState(settings.showCodePreview);
  const [previewLines, setPreviewLines] = useState(settings.previewLines);
  const [includeCodeInSearch, setIncludeCodeInSearch] = useState(settings.includeCodeInSearch);
  const [showCategories, setShowCategories] = useState(settings.showCategories);
  const [expandCategories, setExpandCategories] = useState(settings.expandCategories);
  const [showLineNumbers, setShowLineNumbers] = useState(settings.showLineNumbers);

  const handleSave = () => {
    onSettingsChange({
      compactView,
      showCodePreview,
      previewLines,
      includeCodeInSearch,
      showCategories,
      expandCategories,
      showLineNumbers
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="pb-4">
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
          <div className="flex items-center justify-between">
            <label htmlFor="showCategories" className="text-gray-300">Show Categories</label>
            <input
              type="checkbox"
              id="showCategories"
              checked={showCategories}
              onChange={(e) => setShowCategories(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
          
          {showCategories && (
            <div className="flex items-center justify-between">
              <label htmlFor="expandCategories" className="text-gray-300">Expand Categories</label>
              <input
                type="checkbox"
                id="expandCategories"
                checked={expandCategories}
                onChange={(e) => setExpandCategories(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <label htmlFor="showLineNumbers" className="text-gray-300">Show Line Numbers</label>
            <input
              type="checkbox"
              id="showLineNumbers"
              checked={showLineNumbers}
              onChange={(e) => setShowLineNumbers(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex gap-4 justify-center">
              <a 
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 transition-opacity"
                title="GitHub Repository"
              >
                <img 
                  src="/github-mark-white.svg" 
                  alt="GitHub" 
                  className="w-6 h-6"
                />
              </a>
              <a 
                href={DOCKER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 transition-opacity"
                title="GitHub Packages"
              >
                <img 
                  src="/docker-mark-white.svg" 
                  alt="Docker" 
                  className="w-6 h-6"
                />
              </a>
              <a 
                href={REDDIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 transition-opacity"
                title="Reddit Post"
              >
                <img 
                  src="/reddit-mark-white.svg" 
                  alt="Reddit" 
                  className="w-6 h-6"
                />
              </a>
              <a 
                href={WIKI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 transition-opacity"
                title="Documentation"
              >
                <BookOpen className="w-6 h-6 text-white" />
              </a>
            </div>
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
      </div>
    </Modal>
  );
};

export default SettingsModal;