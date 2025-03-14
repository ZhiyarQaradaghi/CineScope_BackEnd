const axios = require("axios");
const Movie = require("../models/Movie");

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

const convertMovieData = (movie) => {
  return {
    movieId: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    genres: movie.genres || [],
    runtime: movie.runtime,
    tmdbData: movie,
  };
};

const filterMoviesByGenre = (movies, genreId) => {
  if (!genreId) return movies;

  const genreIdNum = Number(genreId);

  return movies.filter((movie) => {
    if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
      return movie.genre_ids.includes(genreIdNum);
    }

    if (movie.genres && Array.isArray(movie.genres)) {
      return movie.genres.some((genre) => genre.id === genreIdNum);
    }

    return false;
  });
};

const filterMoviesByGenreAndYear = (movies, genreId, year) => {
  return movies.filter((movie) => {
    let passesGenreFilter = true;
    let passesYearFilter = true;

    if (genreId) {
      const genreIdNum = Number(genreId);
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        passesGenreFilter = movie.genre_ids.includes(genreIdNum);
      } else if (movie.genres && Array.isArray(movie.genres)) {
        passesGenreFilter = movie.genres.some(
          (genre) => genre.id === genreIdNum
        );
      } else {
        passesGenreFilter = false;
      }
    }

    if (year) {
      passesYearFilter =
        movie.release_date && movie.release_date.startsWith(year);
    }

    return passesGenreFilter && passesYearFilter;
  });
};

const validatePage = (page) => {
  const validatedPage = Math.max(1, Math.min(500, page));
  if (validatedPage !== page) {
    console.warn(
      `Requested page ${page} is out of bounds. Using page ${validatedPage} instead.`
    );
  }
  return validatedPage;
};

const getPopularMovies = async (page = 1, params = {}) => {
  try {
    const validPage = validatePage(page);
    const genreId = params.with_genres;
    const year = params.primary_release_year;
    let allResults = [];
    let currentPage = 1;
    const MAX_PAGES = 25;

    if (genreId || year) {
      while (currentPage <= MAX_PAGES) {
        const response = await tmdbApi.get("/movie/popular", {
          params: {
            page: currentPage,
          },
        });

        const filteredResults = filterMoviesByGenreAndYear(
          response.data.results,
          genreId,
          year
        );
        allResults = [...allResults, ...filteredResults];

        if (
          currentPage >= response.data.total_pages ||
          allResults.length >= 500
        )
          break;
        currentPage++;
      }

      const startIndex = (validPage - 1) * 20;
      const paginatedResults = allResults.slice(startIndex, startIndex + 20);

      return {
        results: paginatedResults,
        page: validPage,
        total_pages: Math.ceil(allResults.length / 20),
        total_results: allResults.length,
      };
    } else {
      const response = await tmdbApi.get("/movie/popular", {
        params: {
          page: validPage,
          ...params,
        },
      });

      return {
        results: response.data.results,
        page: response.data.page,
        total_pages: Math.min(500, response.data.total_pages),
        total_results: response.data.total_results,
      };
    }
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw new Error(error.message || "Failed to fetch popular movies");
  }
};

const getTopRatedMovies = async (page = 1, params = {}) => {
  try {
    const validPage = validatePage(page);
    const genreId = params.with_genres;
    let allResults = [];
    let currentPage = 1;

    if (genreId) {
      while (currentPage <= 5) {
        const response = await tmdbApi.get("/movie/top_rated", {
          params: {
            page: currentPage,
          },
        });

        const filteredResults = filterMoviesByGenre(
          response.data.results,
          genreId
        );
        allResults = [...allResults, ...filteredResults];

        if (currentPage >= response.data.total_pages) break;
        currentPage++;
      }

      const startIndex = (validPage - 1) * 20;
      const paginatedResults = allResults.slice(startIndex, startIndex + 20);

      return {
        results: paginatedResults,
        page: validPage,
        total_pages: Math.ceil(allResults.length / 20),
        total_results: allResults.length,
      };
    } else {
      const response = await tmdbApi.get("/movie/top_rated", {
        params: {
          page: validPage,
          ...params,
        },
      });

      return {
        results: response.data.results,
        page: response.data.page,
        total_pages: Math.min(500, response.data.total_pages),
        total_results: response.data.total_results,
      };
    }
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    throw new Error(error.message || "Failed to fetch top rated movies");
  }
};

const getUpcomingMovies = async (page = 1, params = {}) => {
  try {
    const validPage = validatePage(page);
    const genreId = params.with_genres;
    let allResults = [];
    let currentPage = 1;

    if (genreId) {
      while (currentPage <= 5) {
        const response = await tmdbApi.get("/movie/upcoming", {
          params: {
            page: currentPage,
          },
        });

        const filteredResults = filterMoviesByGenre(
          response.data.results,
          genreId
        );
        allResults = [...allResults, ...filteredResults];

        if (currentPage >= response.data.total_pages) break;
        currentPage++;
      }

      const startIndex = (validPage - 1) * 20;
      const paginatedResults = allResults.slice(startIndex, startIndex + 20);

      return {
        results: paginatedResults,
        page: validPage,
        total_pages: Math.ceil(allResults.length / 20),
        total_results: allResults.length,
      };
    } else {
      const response = await tmdbApi.get("/movie/upcoming", {
        params: {
          page: validPage,
          ...params,
        },
      });

      return {
        results: response.data.results,
        page: response.data.page,
        total_pages: Math.min(500, response.data.total_pages),
        total_results: response.data.total_results,
      };
    }
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    throw new Error(error.message || "Failed to fetch upcoming movies");
  }
};

const searchMovies = async (query, page = 1, params = {}) => {
  try {
    const validPage = validatePage(page);
    const genreId = params.with_genres;

    console.log("TMDB API search call with params:", {
      query,
      page: validPage,
      ...params,
    });

    const response = await tmdbApi.get("/search/movie", {
      params: {
        query,
        page: validPage,
        ...params,
      },
    });

    let results = response.data.results;

    if (genreId) {
      results = filterMoviesByGenre(results, genreId);
    }

    return {
      results: results,
      page: response.data.page,
      total_pages: Math.min(500, response.data.total_pages),
      total_results: genreId ? results.length : response.data.total_results,
    };
  } catch (error) {
    console.error("Error searching movies:", error);
    throw new Error(error.message || "Failed to search movies");
  }
};

const getMovieDetails = async (movieId) => {
  try {
    const cachedMovie = await Movie.findOne({
      movieId,
      lastUpdated: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (cachedMovie) {
      return cachedMovie.tmdbData;
    }

    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "videos,credits",
      },
    });

    await Movie.findOneAndUpdate({ movieId }, convertMovieData(response.data), {
      upsert: true,
      new: true,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw new Error(`Failed to fetch movie details for ID ${movieId}`);
  }
};

const getGenres = async () => {
  try {
    const response = await tmdbApi.get("/genre/movie/list");
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw new Error("Failed to fetch genres from TMDB");
  }
};

module.exports = {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
};
