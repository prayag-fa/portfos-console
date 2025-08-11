"use client";
import React, { useState, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  
  // Display props
  icon,
  showCheck = true,
  
  // Custom render props
  renderOption,
  renderSelected,
  
  // Selection logic
  isSelected,
  onOptionSelect,
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
  const handleOptionClick = (option) => {
    if (onOptionSelect) {
      onOptionSelect(option);
    } else {
      onChange(option.value);
    }
    onToggle();
  };

  // Get selected option
  const getSelectedOption = () => {
    return options.find(option => 
      isSelected ? isSelected(option) : option.value === value
    );
  };

  // Check if option is selected
  const isOptionSelected = (option) => {
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
  const renderOptionItem = (option) => {
    if (renderOption) {
      return renderOption(option, isOptionSelected(option));
    }

    return (
      <div className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-50 transition-colors duration-200">
        <span className="text-gray-700">{option.label}</span>
        {showCheck && isOptionSelected(option) && (
          <Check className="w-3.5 h-3.5 text-blue-500" />
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-2 py-1.5 border text-xs border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 min-w-32 justify-between"
      >
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="font-medium text-gray-700">
          {renderSelectedValue()}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left"
              >
                {renderOptionItem(option)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
