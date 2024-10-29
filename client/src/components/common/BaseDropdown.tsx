import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Section {
  title: string;
  items: string[];
}

export interface BaseDropdownProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  getSections: (searchTerm: string) => Section[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  value,
  onChange,
  onSelect,
  onKeyDown,
  getSections,
  placeholder = "Select or type a value",
  className = "",
  disabled = false,
  maxLength
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = maxLength ? e.target.value.slice(0, maxLength) : e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionClick = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e);
      if (e.defaultPrevented) return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const sections = getSections(value);
      if (sections.length > 0) {
        const lastSection = sections[sections.length - 1];
        if (lastSection.items.length > 0) {
          handleOptionClick(lastSection.items[0]);
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const sections = getSections(value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={`mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 pr-8 text-sm ${className}`}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
        />
        <ChevronDown 
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
          size={16}
        />
      </div>
      {isOpen && sections.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {sections.map((section, sectionIndex) => (
            <React.Fragment key={section.title}>
              {sectionIndex > 0 && (
                <li className="border-t border-gray-600" />
              )}
              <li className="px-3 py-1 text-xs font-medium text-gray-400 bg-gray-800">
                {section.title}
              </li>
              {section.items.map((item, index) => (
                <li
                  key={`${section.title}-${index}`}
                  className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                  onClick={() => handleOptionClick(item)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {item}
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BaseDropdown;