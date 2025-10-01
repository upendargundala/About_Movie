import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [searchWord, setSearchWord] = useState("");
  const [moviesData, setMoviesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showMovieDetails, setShowMovieDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeNav, setActiveNav] = useState('home');
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Default suggested movies
  const defaultMovies = [
    { 
      Title: "The Dark Knight", 
      Year: "2008", 
      imdbID: "tt0468569", 
      Type: "movie", 
      Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg" 
    },
    { 
      Title: "Interstellar", 
      Year: "2014", 
      imdbID: "tt0816692", 
      Type: "movie", 
      Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" 
    },
    { 
      Title: "Fight Club", 
      Year: "1999", 
      imdbID: "tt0137523", 
      Type: "movie", 
      Poster: "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg" 
    },
    { 
      Title: "John Wick", 
      Year: "2014", 
      imdbID: "tt2911666", 
      Type: "movie", 
      Poster: "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_SX300.jpg" 
    },
    { 
      Title: "Game of Thrones", 
      Year: "2011-2019", 
      imdbID: "tt0944947", 
      Type: "series", 
      Poster: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg" 
    },
    { 
      Title: "Breaking Bad", 
      Year: "2008-2013", 
      imdbID: "tt0903747", 
      Type: "series", 
      Poster: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg" 
    }
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('movieSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing search history:', error);
        setSearchHistory([]);
      }
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('movieSearchHistory', JSON.stringify(searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, [searchHistory]);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply theme to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Navigation functions
  const handleNavigation = (section) => {
    setActiveNav(section);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      clearSearch();
    } else if (section === 'movies') {
      setShowSuggestions(true);
      setMoviesData([]);
      setTimeout(() => {
        const element = document.getElementById('main-content');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (section === 'tv-shows') {
      setShowSuggestions(true);
      setMoviesData(defaultMovies.filter(movie => movie.Type === 'series'));
      setTimeout(() => {
        const element = document.getElementById('main-content');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (section === 'genres') {
      setShowSuggestions(true);
      setMoviesData([]);
      setTimeout(() => {
        const element = document.getElementById('main-content');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const searchMovies = async (query = searchWord) => {
    const searchTerm = query || searchWord;
    if (!searchTerm.trim()) {
      alert("Please enter a search term");
      return;
    }
    
    setIsLoading(true);
    setShowSuggestions(false);
    setShowSearchHistory(false);
    
    try {
      let apipath = `https://www.omdbapi.com/?apikey=885c5bb8&s=${encodeURIComponent(searchTerm)}`;
      
      let apiResponse = await axios.get(apipath);
      
      if (apiResponse.data.Response === "True" && apiResponse.data.Search) {
        setMoviesData(apiResponse.data.Search);
        
        // Add to search history if not already present
        if (!searchHistory.includes(searchTerm)) {
          const newHistory = [searchTerm, ...searchHistory.slice(0, 9)];
          setSearchHistory(newHistory);
        }
      } else {
        setMoviesData([]);
        alert("No results found for your search");
      }
    } catch (ex) {
      console.error('Search error:', ex);
      alert("Unable to process your request. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMovies();
    }
  };

  // View movie details
  const viewMovieDetails = async (imdbID) => {
    if (!imdbID) {
      alert("Movie details not available");
      return;
    }
    
    try {
      setIsLoading(true);
      let apipath = `https://www.omdbapi.com/?apikey=885c5bb8&i=${imdbID}&plot=full`;
      let apiResponse = await axios.get(apipath);
      
      if (apiResponse.data.Response === "True") {
        setSelectedMovie(apiResponse.data);
        setShowMovieDetails(true);
      } else {
        alert("Unable to fetch movie details");
      }
    } catch (ex) {
      console.error('Movie details error:', ex);
      alert("Unable to fetch movie details");
    } finally {
      setIsLoading(false);
    }
  };

  // Close movie details
  const closeMovieDetails = () => {
    setShowMovieDetails(false);
    setSelectedMovie(null);
  };

  // Quick search with trending tags or history items
  const quickSearch = (term) => {
    setSearchWord(term);
    setShowSearchHistory(false);
    setTimeout(() => {
      searchMovies(term);
    }, 100);
  };

  // Remove item from search history
  const removeFromHistory = (term, e) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(item => item !== term);
    setSearchHistory(newHistory);
  };

  // Clear all search history
  const clearAllHistory = () => {
    setSearchHistory([]);
  };

  // Clear current search and show suggestions
  const clearSearch = () => {
    setSearchWord("");
    setMoviesData([]);
    setShowSuggestions(true);
    setActiveNav('home');
    setShowSearchHistory(false);
  };

  // Explore trending function
  const exploreTrending = () => {
    const trendingTerms = ['action', 'comedy', 'drama', 'adventure', 'thriller'];
    const randomTerm = trendingTerms[Math.floor(Math.random() * trendingTerms.length)];
    
    setSearchWord(randomTerm);
    setShowSearchHistory(false);
    setShowSuggestions(false);
    setIsLoading(true);
    
    searchMovies(randomTerm);
  };

  // Social media functions
  const handleSocialClick = (platform) => {
    alert(`Redirecting to our ${platform} page! (This is a demo - in a real app, this would open the actual social media page)`);
  };

  // Get filtered movies based on active navigation
  const getFilteredMovies = () => {
    return defaultMovies.filter(movie => {
      if (activeNav === 'movies') return movie.Type === 'movie';
      if (activeNav === 'tv-shows') return movie.Type === 'series';
      return true;
    });
  };

  return (
    <div className={`movie-app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header Section */}
      <header className="app-header">
        <div className="logo" onClick={() => handleNavigation('home')} style={{cursor: 'pointer'}}>
          <i className="fas fa-film"></i>
          <span>MovieExplorer</span>
        </div>
        
        <div className="header-controls">
          <nav className="navigation">
            <a 
              href="#home" 
              className={activeNav === 'home' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('home');
              }}
            >
              Home
            </a>
            <a 
              href="#movies" 
              className={activeNav === 'movies' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('movies');
              }}
            >
              Movies
            </a>
            <a 
              href="#tv-shows" 
              className={activeNav === 'tv-shows' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('tv-shows');
              }}
            >
              TV Shows
            </a>
            <a 
              href="#genres" 
              className={activeNav === 'genres' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('genres');
              }}
            >
              Genres
            </a>
          </nav>
          
          {/* Dark Mode Toggle */}
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <><i className="fas fa-sun"></i> {!isMobile && 'Light Mode'}</>
            ) : (
              <><i className="fas fa-moon"></i> {!isMobile && 'Dark Mode'}</>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <h1>Discover Amazing Movies</h1>
          <p>Search through thousands of movies from all genres and eras</p>
          
          {/* Search Container with Dropdown */}
          <div className="search-wrapper">
            <div className="search-container">
              <div className="search-icon-left">
                <i className="fas fa-clapperboard"></i>
              </div>
              <input
                type="text"
                className="search-bar"
                placeholder="Search for movies, series..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSearchHistory(true)}
              />
              {searchWord && (
                <button className="clear-search" onClick={clearSearch} aria-label="Clear search">
                  <i className="fas fa-times"></i>
                </button>
              )}
              <button className="search-button" onClick={() => searchMovies()} aria-label="Search">
                <i className="fas fa-search"></i>
              </button>
            </div>

            {/* Search History Dropdown - Positioned absolutely */}
            {showSearchHistory && searchHistory.length > 0 && (
              <div className="search-history-dropdown">
                <div className="history-header">
                  <span>Recent Searches</span>
                  <button className="clear-all-history" onClick={clearAllHistory}>
                    Clear All
                  </button>
                </div>
                <div className="history-items">
                  {searchHistory.map((term, index) => (
                    <div 
                      key={index} 
                      className="history-item"
                      onClick={() => quickSearch(term)}
                    >
                      <i className="fas fa-history"></i>
                      <span className="history-term">{term}</span>
                      <button 
                        className="remove-history-item"
                        onClick={(e) => removeFromHistory(term, e)}
                        aria-label={`Remove ${term} from history`}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="trending-tags">
            <span>Trending:</span>
            <button className="tag" onClick={() => quickSearch("action")}>Action</button>
            <button className="tag" onClick={() => quickSearch("comedy")}>Comedy</button>
            <button className="tag" onClick={() => quickSearch("drama")}>Drama</button>
            <button className="tag" onClick={() => quickSearch("2023")}>2023 Releases</button>
          </div>

          <button className="cta-button" onClick={exploreTrending}>
            <i className="fas fa-fire"></i> Explore Trending
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content" id="main-content">
        <div className="container">
          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Searching for movies...</p>
            </div>
          ) : (
            <>
              {moviesData.length > 0 && (
                <div className="results-header">
                  <h2>Search Results for "{searchWord}"</h2>
                  <p>{moviesData.length} movies found</p>
                </div>
              )}
              
              {/* Show default movies when no search is performed */}
              {showSuggestions && moviesData.length === 0 && (
                <div className="suggestions-section">
                  <h2 className="section-title">
                    {activeNav === 'tv-shows' ? 'Popular TV Shows' : 
                     activeNav === 'movies' ? 'Popular Movies' : 
                     'Popular Movies & Series'}
                  </h2>
                  
                  {/* Genre buttons for genres section */}
                  {activeNav === 'genres' && (
                    <div className="genres-container">
                      <h3 className="genres-title">Browse by Genre</h3>
                      <div className="genres-grid">
                        <button className="genre-btn action" onClick={() => quickSearch("action")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-explosion"></i>
                            <span>Action</span>
                          </div>
                        </button>
                        <button className="genre-btn comedy" onClick={() => quickSearch("comedy")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-laugh"></i>
                            <span>Comedy</span>
                          </div>
                        </button>
                        <button className="genre-btn drama" onClick={() => quickSearch("drama")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-theater-masks"></i>
                            <span>Drama</span>
                          </div>
                        </button>
                        <button className="genre-btn scifi" onClick={() => quickSearch("sci-fi")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-robot"></i>
                            <span>Sci-Fi</span>
                          </div>
                        </button>
                        <button className="genre-btn horror" onClick={() => quickSearch("horror")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-ghost"></i>
                            <span>Horror</span>
                          </div>
                        </button>
                        <button className="genre-btn romance" onClick={() => quickSearch("romance")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-heart"></i>
                            <span>Romance</span>
                          </div>
                        </button>
                        <button className="genre-btn thriller" onClick={() => quickSearch("thriller")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-user-secret"></i>
                            <span>Thriller</span>
                          </div>
                        </button>
                        <button className="genre-btn fantasy" onClick={() => quickSearch("fantasy")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-dragon"></i>
                            <span>Fantasy</span>
                          </div>
                        </button>
                        <button className="genre-btn adventure" onClick={() => quickSearch("adventure")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-mountain"></i>
                            <span>Adventure</span>
                          </div>
                        </button>
                        <button className="genre-btn animation" onClick={() => quickSearch("animation")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-film"></i>
                            <span>Animation</span>
                          </div>
                        </button>
                        <button className="genre-btn mystery" onClick={() => quickSearch("mystery")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-search"></i>
                            <span>Mystery</span>
                          </div>
                        </button>
                        <button className="genre-btn crime" onClick={() => quickSearch("crime")}>
                          <div className="genre-btn-content">
                            <i className="fas fa-handcuffs"></i>
                            <span>Crime</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="movies-grid">
                    {getFilteredMovies().map((movie, index) => (
                      <div key={`${movie.imdbID}-${index}`} className="movie-card">
                        <div className="movie-poster">
                          <img
                            src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450/2c3e50/ecf0f1?text=No+Poster"}
                            alt={movie.Title}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x450/2c3e50/ecf0f1?text=No+Poster";
                            }}
                          />
                          <div className="movie-overlay">
                            <button 
                              className="view-details" 
                              onClick={() => viewMovieDetails(movie.imdbID)}
                            >
                              <i className="fas fa-eye"></i> View Details
                            </button>
                          </div>
                        </div>
                        <div className="movie-info">
                          <h3 className="movie-title">{movie.Title}</h3>
                          <div className="movie-meta">
                            <span className="movie-year">{movie.Year}</span>
                            <span className="movie-type">{movie.Type}</span>
                          </div>
                          <button 
                            className="imdb-link"
                            onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank')}
                          >
                            <i className="fab fa-imdb"></i> View on IMDb
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Show search results */}
              {moviesData.length > 0 && (
                <div className="movies-grid">
                  {moviesData.map((movie, index) => (
                    <div key={`${movie.imdbID}-${index}`} className="movie-card">
                      <div className="movie-poster">
                        <img
                          src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450/2c3e50/ecf0f1?text=No+Poster"}
                          alt={movie.Title}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x450/2c3e50/ecf0f1?text=No+Poster";
                          }}
                        />
                        <div className="movie-overlay">
                          <button 
                            className="view-details" 
                            onClick={() => viewMovieDetails(movie.imdbID)}
                          >
                            <i className="fas fa-eye"></i> View Details
                          </button>
                        </div>
                      </div>
                      <div className="movie-info">
                        <h3 className="movie-title">{movie.Title}</h3>
                        <div className="movie-meta">
                          <span className="movie-year">{movie.Year}</span>
                          <span className="movie-type">{movie.Type}</span>
                        </div>
                        <button 
                          className="imdb-link"
                          onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank')}
                        >
                          <i className="fab fa-imdb"></i> View on IMDb
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {moviesData.length === 0 && !isLoading && !showSuggestions && (
                <div className="empty-state">
                  <i className="fas fa-film"></i>
                  <h3>No Movies Found</h3>
                  <p>Try searching with different keywords or browse our popular suggestions</p>
                  <button className="cta-button" onClick={clearSearch}>
                    Back to Home
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Movie Details Modal */}
      {showMovieDetails && selectedMovie && (
        <div className="modal-overlay" onClick={closeMovieDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeMovieDetails} aria-label="Close modal">
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-body">
              <div className="modal-poster">
                <img
                  src={selectedMovie.Poster && selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "https://via.placeholder.com/300x450/2c3e50/ecf0f1?text=No+Poster"}
                  alt={selectedMovie.Title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x450/2c3e50/ecf0f1?text=No+Poster";
                  }}
                />
              </div>
              
              <div className="modal-info">
                <h2>{selectedMovie.Title}</h2>
                <div className="modal-meta">
                  <span className="modal-year">{selectedMovie.Year}</span>
                  <span className="modal-runtime">{selectedMovie.Runtime || 'N/A'}</span>
                  <span className="modal-rated">{selectedMovie.Rated || 'N/A'}</span>
                </div>
                
                {selectedMovie.Ratings && selectedMovie.Ratings.length > 0 && (
                  <div className="modal-ratings">
                    {selectedMovie.Ratings.map((rating, index) => (
                      <div key={index} className="rating-item">
                        <span className="rating-source">{rating.Source}</span>
                        <span className="rating-value">{rating.Value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="modal-plot">
                  <h3>Plot</h3>
                  <p>{selectedMovie.Plot || 'No plot available.'}</p>
                </div>
                
                <div className="modal-details">
                  <div className="detail-item">
                    <strong>Director:</strong> {selectedMovie.Director || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Actors:</strong> {selectedMovie.Actors || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Genre:</strong> {selectedMovie.Genre || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Language:</strong> {selectedMovie.Language || 'N/A'}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="imdb-button"
                    onClick={() => window.open(`https://www.imdb.com/title/${selectedMovie.imdbID}`, '_blank')}
                  >
                    <i className="fab fa-imdb"></i> View on IMDb
                  </button>
                  <button className="close-button" onClick={closeMovieDetails}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-film"></i>
            <span>MovieExplorer</span>
          </div>
          <p>© 2023 MovieExplorer. All rights reserved.</p>
          <div className="social-links">
            <button 
              className="social-button"
              onClick={() => handleSocialClick('Facebook')}
              aria-label="Facebook"
            >
              <i className="fab fa-facebook"></i>
            </button>
            <button 
              className="social-button"
              onClick={() => handleSocialClick('Twitter')}
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </button>
            <button 
              className="social-button"
              onClick={() => handleSocialClick('Instagram')}
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;