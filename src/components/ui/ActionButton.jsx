"use client";

import React from "react";

const ActionButton = ({ icon, onClick, title }) => {
  const Icon = icon;
  return (
    <button className="inline-flex items-center p-2 rounded text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-150" onClick={onClick} title={title}>
      <Icon size={16} />
    </button>
  );
};

export default ActionButton;