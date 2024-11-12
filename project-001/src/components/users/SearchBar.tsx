import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { SearchBarProps } from "../../types/users";

const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm }) => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex items-center justify-center  ">
      <div className="flex w-full mx-10 rounded bg-white">
        <input
          className=" w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
          type="search"
          name="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setSearchTerm(search);
          }}
          className="m-2 rounded bg-blue-600 px-4 py-2 text-white"
        >
          <BiSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
