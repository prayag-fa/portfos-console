'use client';
import { useCallback, useState } from 'react';

import { Check, ChevronDown } from 'lucide-react';

import { useClickOutside } from '@/hooks/useClickOutside';

export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select option',
  className = '',

  // Display props
  icon,
  showCheck = true,

  // Custom render props
  renderOption,
  renderSelected,

  // Selection logic
  isSelected,
  onOptionSelect
}) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ref = useClickOutside(closeDropdown);

  const onToggle = () => {
    setIsOpen(prev => !prev);
  };

  // Handle option selection
  const handleOptionClick = option => {
    if (onOptionSelect) {
      onOptionSelect(option);
    } else {
      onChange(option.value);
    }
    onToggle();
  };

  // Get selected option
  const getSelectedOption = () => {
    return options.find(option => (isSelected ? isSelected(option) : option.value === value));
  };

  // Check if option is selected
  const isOptionSelected = option => {
    return isSelected ? isSelected(option) : option.value === value;
  };

  // Render selected value
  const renderSelectedValue = () => {
    if (renderSelected) {
      return renderSelected(getSelectedOption());
    }

    const selected = getSelectedOption();
    return selected ? selected.label : placeholder;
  };

  // Render option
  const renderOptionItem = option => {
    if (renderOption) {
      return renderOption(option, isOptionSelected(option));
    }

    return (
      <div className='flex w-full items-center justify-between px-3 py-2 text-xs transition-all duration-150 ease-out hover:bg-blue-50'>
        <span className='text-gray-700 transition-colors duration-150'>{option.label}</span>
        {showCheck && isOptionSelected(option) && <Check className='size-3.5 text-blue-500' />}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={onToggle}
        className='flex min-w-32 items-center justify-between gap-2 rounded-md border border-gray-300 px-2 py-1.5 text-xs transition-all duration-150 ease-out hover:bg-gray-50 hover:border-gray-400'
      >
        {icon && <span className='text-gray-400'>{icon}</span>}
        <span className='font-medium text-gray-700'>{renderSelectedValue()}</span>
        <ChevronDown
          className={`size-3.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-150 ease-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-0.5 pointer-events-none'
        }`}
      >
        <div className='py-1'>
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className='w-full text-left'
              style={{
                animationDelay: isOpen ? `${index * 50}ms` : '0ms'
              }}
            >
              <div
                className={`transform transition-all duration-150 ease-out ${
                  isOpen ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'
                }`}
              >
                {renderOptionItem(option)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
