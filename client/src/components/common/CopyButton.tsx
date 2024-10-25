import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { CopyButtonProps } from '../../types/types';

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
        } finally {
          textArea.remove();
        }
      }
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
      title="Copy to clipboard"
    >
      {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
    </button>
  );
};

export default CopyButton;