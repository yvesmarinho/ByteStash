import React, { useRef, useState } from 'react';
import { MoreVertical, Share, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { IconButton } from '../../common/buttons/IconButton';

interface SnippetCardMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  onOpenInNewTab: () => void;
}

export const SnippetCardMenu: React.FC<SnippetCardMenuProps> = ({
  onEdit,
  onDelete,
  onShare,
  onOpenInNewTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useOutsideClick(menuRef, () => setIsOpen(false), [buttonRef]);

  const handleItemClick = (handler: () => void) => {
    setIsOpen(false);
    handler();
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <IconButton
        ref={buttonRef}
        icon={<MoreVertical size={16} />}
        onClick={handleMenuToggle}
        variant="custom"
        size="sm"
        className="opacity-0 group-hover:opacity-100 bg-gray-700 hover:bg-gray-600"
      />

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute right-0 top-8 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 py-1 z-50"
        >
          <button
            onClick={() => handleItemClick(onOpenInNewTab)}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
          >
            <ExternalLink size={16} className="text-gray-400" />
            Open in new tab
          </button>
          <button
            onClick={() => handleItemClick(onShare)}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
          >
            <Share size={16} className="text-gray-400" />
            Share
          </button>
          <button
            onClick={() => handleItemClick(onEdit)}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
          >
            <Pencil size={16} className="text-gray-400" />
            Edit
          </button>
          <button
            onClick={() => handleItemClick(onDelete)}
            className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-700 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};