import React, { useRef, useState } from 'react';
import { AlertCircle, BookOpen, Clock, Download, Upload } from 'lucide-react';
import Modal from '../common/modals/Modal';
import ChangelogModal from '../common/modals/ChangelogModal';
import { useToast } from '../../hooks/useToast';
import { Snippet } from '../../types/snippets';

const GITHUB_URL = "https://github.com/jordan-dalby/ByteStash";
const DOCKER_URL = "https://github.com/jordan-dalby/ByteStash/pkgs/container/bytestash";
const REDDIT_URL = "https://www.reddit.com/r/selfhosted/comments/1gb1ail/selfhosted_code_snippet_manager/";
const WIKI_URL = "https://github.com/jordan-dalby/ByteStash/wiki";

interface ImportProgress {
  total: number;
  current: number;
  succeeded: number;
  failed: number;
  errors: { title: string; error: string }[];
}

interface ImportData {
  version: string;
  exported_at: string;
  snippets: Omit<Snippet, 'id' | 'updated_at'>[];
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    compactView: boolean;
    showCodePreview: boolean;
    previewLines: number;
    includeCodeInSearch: boolean;
    showCategories: boolean;
    expandCategories: boolean;
    showLineNumbers: boolean;
  };
  onSettingsChange: (newSettings: SettingsModalProps['settings']) => void;
  snippets: Snippet[];
  addSnippet: (snippet: Omit<Snippet, 'id' | 'updated_at'>, toast: boolean) => Promise<Snippet>;
  reloadSnippets: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange,
  snippets,
  addSnippet,
  reloadSnippets
}) => {
  const [compactView, setCompactView] = useState(settings.compactView);
  const [showCodePreview, setShowCodePreview] = useState(settings.showCodePreview);
  const [previewLines, setPreviewLines] = useState(settings.previewLines);
  const [includeCodeInSearch, setIncludeCodeInSearch] = useState(settings.includeCodeInSearch);
  const [showCategories, setShowCategories] = useState(settings.showCategories);
  const [expandCategories, setExpandCategories] = useState(settings.expandCategories);
  const [showLineNumbers, setShowLineNumbers] = useState(settings.showLineNumbers);
  const [showChangelog, setShowChangelog] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

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

  const resetImportState = () => {
    setImporting(false);
    setImportProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateImportData = (data: any): data is ImportData => {
    if (!data || typeof data !== 'object') return false;
    if (typeof data.version !== 'string') return false;
    if (!Array.isArray(data.snippets)) return false;
    
    return data.snippets.every((snippet: Snippet) => 
      typeof snippet === 'object' &&
      typeof snippet.title === 'string' &&
      Array.isArray(snippet.fragments) &&
      Array.isArray(snippet.categories)
    );
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const content = await file.text();
      const importData = JSON.parse(content);

      if (!validateImportData(importData)) {
        throw new Error('Invalid import file format');
      }

      const progress: ImportProgress = {
        total: importData.snippets.length,
        current: 0,
        succeeded: 0,
        failed: 0,
        errors: []
      };

      setImportProgress(progress);

      for (const snippet of importData.snippets) {
        try {
          await addSnippet(snippet, false);
          progress.succeeded += 1;
        } catch (error) {
          progress.failed += 1;
          progress.errors.push({
            title: snippet.title,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          console.error(`Failed to import snippet "${snippet.title}":`, error);
        }
        
        progress.current += 1;
        setImportProgress({ ...progress });
      }

      if (progress.failed === 0) {
        addToast(`Successfully imported ${progress.succeeded} snippets`, 'success');
        reloadSnippets();
      } else {
        addToast(
          `Imported ${progress.succeeded} snippets, ${progress.failed} failed. Check console for details.`,
          'warning'
        );
      }
    } catch (error) {
      console.error('Import error:', error);
      addToast(
        error instanceof Error ? error.message : 'Failed to import snippets',
        'error'
      );
    } finally {
      resetImportState();
    }
  };

  const handleExport = () => {
    try {
      const exportData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        snippets: snippets
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bytestash-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addToast('Snippets exported successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      addToast('Failed to export snippets', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<h2 className="text-xl font-bold text-gray-100">Settings</h2>}
    >
      <div className="pb-4">
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

          {/* Export/Import Section */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm"
              >
                <Download size={16} />
                Export Snippets
              </button>
              <label
                className={`flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm cursor-pointer ${
                  importing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  disabled={importing}
                  className="hidden"
                />
                <Upload size={16} />
                Import Snippets
              </label>
            </div>

            {/* Import Progress */}
            {importProgress && (
              <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Importing snippets...</span>
                  <span>
                    {importProgress.current} / {importProgress.total}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-200"
                    style={{
                      width: `${(importProgress.current / importProgress.total) * 100}%`
                    }}
                  />
                </div>

                {/* Error Summary (if any) */}
                {importProgress.errors.length > 0 && (
                  <div className="mt-2 text-sm">
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertCircle size={14} />
                      <span>{importProgress.errors.length} errors occurred</span>
                    </div>
                    <div className="mt-1 max-h-24 overflow-y-auto">
                      {importProgress.errors.map((error, index) => (
                        <div key={index} className="text-red-400 text-xs">
                          Failed to import "{error.title}": {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowChangelog(true)}
                className="opacity-60 hover:opacity-100 transition-opacity"
                title="Changelog"
              >
                <Clock className="w-6 h-6 text-white" />
              </button>
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
      <ChangelogModal
        isOpen={showChangelog}
        onClose={() => setShowChangelog(false)}
      />
    </Modal>
  );
};

export default SettingsModal;