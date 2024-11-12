import React from "react";
import Modal from "../common/Modal";
import FullCodeBlock from "./FullCodeBlock";
import CategoryList from "./categories/CategoryList";
import { FileCode } from "lucide-react";
import { getLanguageLabel } from "../../utils/languageUtils";
import { Snippet } from "@/types/types";

export interface SnippetModalProps {
  snippet: Snippet | null;
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick: (category: string) => void;
  showLineNumbers: boolean;
}

const SnippetModal: React.FC<SnippetModalProps> = ({
  snippet,
  isOpen,
  onClose,
  onCategoryClick,
  showLineNumbers,
}) => {
  if (!snippet) return null;

  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    onCategoryClick(category);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-2xl font-bold text-gray-100">{snippet.title}</h2>
      }
    >
      <p className="text-sm text-gray-300 mb-4 break-words">
        {snippet.description}
      </p>

      <CategoryList
        categories={snippet.categories || []}
        onCategoryClick={handleCategoryClick}
        className="mb-6"
        variant="clickable"
        showAll={true}
      />

      <div className="space-y-6">
        {snippet.fragments.map((fragment, index) => (
          <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="flex items-center gap-2">
                <FileCode size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-200">
                  {fragment.file_name}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {getLanguageLabel(fragment.language)}
              </span>
            </div>
            <div className="p-4">
              <FullCodeBlock
                code={fragment.code}
                language={fragment.language}
                showLineNumbers={showLineNumbers}
              />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default SnippetModal;
