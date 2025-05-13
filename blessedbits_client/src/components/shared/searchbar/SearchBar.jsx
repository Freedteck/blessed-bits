import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./SearchBar.module.css";

const SearchBar = ({
  onSearch,
  placeholder = "Search for creators or topics...",
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className={styles.searchBar}>
      <FaSearch className={styles.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchInput}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
