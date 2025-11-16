import React, { useEffect, useState } from "react";
import API from "../axios";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleChange = async (value) => {
    setInput(value);

    if (value.trim().length === 0) {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    setShowSearchResults(true);

    try {
      const response = await API.get(`/products/search?keyword=${value}`);
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
    } catch {
      setSearchResults([]);
      setNoResults(true);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            HiTeckKart
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="/">Home</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/add_product">Add Product</a>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Categories
                </a>

                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "dark-theme" ? (
                <i className="bi bi-moon-fill"></i>
              ) : (
                <i className="bi bi-sun-fill"></i>
              )}
            </button>

            <div className="d-flex align-items-center cart">
              <a href="/cart" className="nav-link text-dark">
                <i className="bi bi-cart me-2">Cart</i>
              </a>

              <input
                className="form-control me-2"
                type="search"
                placeholder="Search..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
              />

              {showSearchResults && (
                <ul className="list-group search-dropdown">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <li key={result.id} className="list-group-item">
                        <a
                          href={`/product/${result.id}`}
                          className="search-result-link"
                          onClick={() => setShowSearchResults(false)}
                        >
                          {result.name}
                        </a>
                      </li>
                    ))
                  ) : (
                    noResults && (
                      <li className="list-group-item text-danger">
                        No product found
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
