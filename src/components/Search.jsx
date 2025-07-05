import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

const Search = ({ query, onClose, onUserInteraction }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  // Fade-in on mount
  useEffect(() => {
    setShowModal(true);
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            query
          )}&format=json&origin=*`
        );
        const data = await response.json();

        const formattedResults = data.query.search.map((item) => ({
          id: item.pageid,
          title: item.title,
          description: item.snippet.replace(/<[^>]+>/g, ""),
        }));

        setResults(formattedResults);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      if (onClose) onClose();
      if (onUserInteraction) onUserInteraction();
    }, 300); // match fade-out duration
  };

  // Close on outside click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  // Close on Esc key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 overflow-y-auto bg-black bg-opacity-80 backdrop-blur-sm transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={modalRef}
        className="bg-black border border-cyan-500/20 rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-cyan-300 text-xl break-words">
            Search Results for "{query}"
          </h2>
          <button
            onClick={handleClose}
            className="bg-cyan-500 hover:bg-cyan-600 text-black px-3 py-1 rounded-full text-sm transition"
          >
            Close
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="bg-black/70 border border-cyan-500/30 p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-white font-semibold break-words">
                    {item.title}
                  </h3>
                  <p className="text-cyan-300 break-words">
                    {item.description}
                  </p>
                  <a
                    href={`https://en.wikipedia.org/?curid=${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline mt-2 inline-block"
                  >
                    View on Wikipedia
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-cyan-200">No results found.</p>
          )
        )}
      </div>
    </div>
  );
};

Search.propTypes = {
  query: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onUserInteraction: PropTypes.func,
};

export default Search;
