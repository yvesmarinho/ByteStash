import { CustomDropdownProps } from '../../types/types';
import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, maxLength }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        matchCaseAndUpdate();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [options, internalValue]);

  const matchCaseAndUpdate = () => {
    const match = options.find(option => 
      option.toLowerCase() === internalValue.toLowerCase()
    );
    if (match) {
      setInternalValue(match);
      onChange(match);
    } else {
      onChange(internalValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, maxLength);
    setInternalValue(newValue);
  };

  const handleOptionClick = (option: string) => {
    setInternalValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleInputBlur = () => {
    matchCaseAndUpdate();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(false);
      matchCaseAndUpdate();
    }
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(internalValue.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 text-sm"
        value={internalValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder="Select or type a language"
        maxLength={maxLength}
      />
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                onClick={() => handleOptionClick(option)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400 text-sm italic">
              No matching languages found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;