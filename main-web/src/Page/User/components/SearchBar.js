import React, { useEffect, useState } from 'react';

const SearchBar = ({ data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
    onSearch(event.target.value); // Callback to parent component with the search term
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
