import React from "react";
import { Search } from "lucide-react";

export default function SearchInput({ searchTerm, onSearchChange }) {
  return (
    <div className="flex items-center gap-2 py-1 px-2 text-xs border border-gray-300 rounded-md w-56 transition-colors duration-200">
        <Search className="w-3.5 h-3.5 text-gray-400 " />

        <input
            name="search"
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="outline-none"
        />
    </div>
  );
}
