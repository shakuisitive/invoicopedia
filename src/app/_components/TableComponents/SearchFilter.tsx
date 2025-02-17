import React, { useState, useCallback } from "react";
import { Search } from "lucide-react";

interface SearchFilterProps {
  onSearch: (params: { text: string; type: string }) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
  const [searchType, setSearchType] = useState("group");
  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback(
    (text: string, type: string) => {
      onSearch({
        text: text.toLowerCase(),
        type,
      });
    },
    [onSearch]
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setSearchText(newText);
    handleSearch(newText, searchType);
  };

  const handleTypeChange = (type: string) => {
    setSearchType(type);
    handleSearch(searchText, type);
  };

  return (
    <div className="flex items-center gap-4 text-gray-600">
      {/* Segmented Control */}
      <div className="flex bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => handleTypeChange("group")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            searchType === "group"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Groups
        </button>
        <button
          onClick={() => handleTypeChange("parent")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            searchType === "parent"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Parent Tasks
        </button>
        <button
          onClick={() => handleTypeChange("child")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            searchType === "child"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Subtasks
        </button>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          value={searchText}
          onChange={handleTextChange}
          type="text"
          placeholder={`Search ${
            searchType === "group"
              ? "groups"
              : searchType === "parent"
              ? "parent tasks"
              : "subtasks"
          }...`}
          className="border-none outline-none bg-transparent w-64"
        />
      </div>
    </div>
  );
};

export default SearchFilter;
