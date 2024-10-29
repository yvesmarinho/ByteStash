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
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const getAllItems = (sections: Section[]): string[] => {
    return sections.reduce((acc: string[], section) => [...acc, ...section.items], []);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [isOpen, value]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = maxLength ? e.target.value.slice(0, maxLength) : e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionClick = (option: string) => {
    onSelect(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e);
      if (e.defaultPrevented) return;
    }

    const sections = getSections(value);
    const allItems = getAllItems(sections);
    const totalItems = allItems.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setHighlightedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : totalItems - 1
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;

      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < totalItems) {
          handleOptionClick(allItems[highlightedIndex]);
        } else if (sections.length > 0) {
          const lastSection = sections[sections.length - 1];
          if (lastSection.items.length > 0) {
            handleOptionClick(lastSection.items[0]);
          }
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      case 'Tab':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const sections = getSections(value);
  let currentIndex = -1;

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
        <ul 
          ref={listRef}
          className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {sections.map((section, sectionIndex) => (
            <React.Fragment key={section.title}>
              {sectionIndex > 0 && (
                <li className="border-t border-gray-600" />
              )}
              <li className="px-3 py-1 text-xs font-medium text-gray-400 bg-gray-800">
                {section.title}
              </li>
              {section.items.map((item) => {
                currentIndex++;
                return (
                  <li
                    key={`${section.title}-${item}`}
                    className={`px-4 py-2 cursor-pointer text-white text-sm ${
                      highlightedIndex === currentIndex ? 'bg-gray-600' : 'hover:bg-gray-600'
                    }`}
                    onClick={() => handleOptionClick(item)}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlightedIndex(currentIndex)}
                    data-index={currentIndex}
                  >
                    {item}
                  </li>
                );
              })}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BaseDropdown;