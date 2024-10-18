import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => 
    (localStorage.getItem('viewMode') as 'grid' | 'list') || 'grid'
  );
  const [compactView, setCompactView] = useState(() => localStorage.getItem('compactView') === 'true');
  const [showCodePreview, setShowCodePreview] = useState(() => localStorage.getItem('showCodePreview') !== 'false');
  const [previewLines, setPreviewLines] = useState(() => parseInt(localStorage.getItem('previewLines') || '4', 10));
  const [includeCodeInSearch, setIncludeCodeInSearch] = useState(() => localStorage.getItem('includeCodeInSearch') === 'true');

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('compactView', compactView.toString());
  }, [compactView]);

  useEffect(() => {
    localStorage.setItem('showCodePreview', showCodePreview.toString());
  }, [showCodePreview]);

  useEffect(() => {
    localStorage.setItem('previewLines', previewLines.toString());
  }, [previewLines]);

  useEffect(() => {
    localStorage.setItem('includeCodeInSearch', includeCodeInSearch.toString());
  }, [includeCodeInSearch]);

  const updateSettings = (newSettings: {
    compactView: boolean;
    showCodePreview: boolean;
    previewLines: number;
    includeCodeInSearch: boolean;
  }) => {
    setCompactView(newSettings.compactView);
    setShowCodePreview(newSettings.showCodePreview);
    setPreviewLines(newSettings.previewLines);
    setIncludeCodeInSearch(newSettings.includeCodeInSearch);
  };

  return {
    viewMode,
    setViewMode,
    compactView,
    showCodePreview,
    previewLines,
    includeCodeInSearch,
    updateSettings
  };
};