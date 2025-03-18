const axios = require("axios");
const Show = require("../models/Show");

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

const convertShowData = (show) => {
  return {
    showId: show.id,
    name: show.name,
    overview: show.overview,
    posterPath: show.poster_path,
    backdropPath: show.backdrop_path,
    firstAirDate: show.first_air_date,
    voteAverage: show.vote_average,
    voteCount: show.vote_count,
    popularity: show.popularity,
    genres: show.genres || [],
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
    tmdbData: show,
  };
};

const validatePage = (page) => {
  const parsedPage = parseInt(page);
  if (isNaN(parsedPage) || parsedPage < 1) {
    return 1;
  }
  return Math.min(parsedPage, 500);
};

const filterShowsByGenreAndYear = (shows, genreId, year) => {
  return shows.filter((show) => {
    let passesGenreFilter = true;
    let passesYearFilter = true;

    if (genreId) {
      const genreIdNum = Number(genreId);
      if (show.genre_ids && Array.isArray(show.genre_ids)) {
        passesGenreFilter = show.genre_ids.includes(genreIdNum);
      } else if (show.genres && Array.isArray(show.genres)) {
        passesGenreFilter = show.genres.some(
          (genre) => genre.id === genreIdNum
        );
      } else {
        passesGenreFilter = false;
      }
    }

    if (year) {
      passesYearFilter =
        show.first_air_date && show.first_air_date.startsWith(year);
    }

    return passesGenreFilter && passesYearFilter;
  });
};

const getPopularTVShows = async (page = 1, params = {}) => {
  try {
    const validPage = validatePage(page);
    const genreId = params.with_genres;
    const year = params.first_air_date_year;

    if (genreId || year) {
      let allResults = [];
      let currentPage = 1;
      const MAX_PAGES = 5;

      while (currentPage <= MAX_PAGES) {
        const response = await tmdbApi.get("/tv/popular", {
          params: {
            page: currentPage,
          },
        });

        const filteredResults = filterShowsByGenreAndYear(
          response.data.results,
          genreId,
          year
        );
        allResults = [...allResults, ...filteredResults];

        if (
          currentPage >= response.data.total_pages ||
          allResults.length >= 100
        ) {
          break;
        }

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
      const response = await tmdbApi.get("/tv/popular", {
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
    console.error("Error fetching popular TV shows:", error);
    throw new Error(error.message || "Failed to fetch popular TV shows");
  }
};

const getTopRatedTVShows = async (page = 1, params = {}) => {
  try {
    const validPage = validatePage(page);
    const genreId = params.with_genres;
    const year = params.first_air_date_year;

    if (genreId || year) {
      let allResults = [];
      let currentPage = 1;
      const MAX_PAGES = 5;

      while (currentPage <= MAX_PAGES) {
        const response = await tmdbApi.get("/tv/top_rated", {
          params: {
            page: currentPage,
          },
        });

        const filteredResults = filterShowsByGenreAndYear(
          response.data.results,
          genreId,
          year
        );
        allResults = [...allResults, ...filteredResults];

        if (
          currentPage >= response.data.total_pages ||
          allResults.length >= 100
        ) {
          break;
        }

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
      const response = await tmdbApi.get("/tv/top_rated", {
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
    console.error("Error fetching top rated TV shows:", error);
    throw new Error(error.message || "Failed to fetch top rated TV shows");
  }
};

const getOnAirTVShows = async (page = 1, params = {}) => {
  try {
    const validPage = validatePage(page);
    const genreId = params.with_genres;
    const year = params.first_air_date_year;

    if (genreId || year) {
      let allResults = [];
      let currentPage = 1;
      const MAX_PAGES = 5;

      while (currentPage <= MAX_PAGES) {
        const response = await tmdbApi.get("/tv/on_the_air", {
          params: {
            page: currentPage,
          },
        });

        const filteredResults = filterShowsByGenreAndYear(
          response.data.results,
          genreId,
          year
        );
        allResults = [...allResults, ...filteredResults];

        if (
          currentPage >= response.data.total_pages ||
          allResults.length >= 100
        ) {
          break;
        }

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
      const response = await tmdbApi.get("/tv/on_the_air", {
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
    console.error("Error fetching on air TV shows:", error);
    throw new Error(error.message || "Failed to fetch on air TV shows");
  }
};

const searchTVShows = async (query, page = 1, params = {}) => {
  try {
    if (!query) {
      throw new Error("Search query is required");
    }

    const validPage = validatePage(page);

    const response = await tmdbApi.get("/search/tv", {
      params: {
        query,
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
  } catch (error) {
    console.error("Error searching TV shows:", error);
    throw new Error(error.message || "Failed to search TV shows");
  }
};

const getTVShowDetails = async (showId) => {
  try {
    // this is to check if the show is cached in our database
    const cachedShow = await Show.findOne({ showId: parseInt(showId) });

    // if the show is cached and was updated less than 24 hours ago, return it else fetch the latest data from TMDB
    if (
      cachedShow &&
      cachedShow.lastUpdated &&
      new Date() - new Date(cachedShow.lastUpdated) < 24 * 60 * 60 * 1000
    ) {
      return cachedShow.tmdbData;
    }

    const response = await tmdbApi.get(`/tv/${showId}`, {
      params: {
        append_to_response: "videos,credits",
      },
    });

    await Show.findOneAndUpdate(
      { showId: parseInt(showId) },
      convertShowData(response.data),
      {
        upsert: true,
        new: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching TV show details for ID ${showId}:`, error);
    throw new Error(`Failed to fetch TV show details for ID ${showId}`);
  }
};

const getTVShowSeason = async (showId, seasonNumber) => {
  try {
    const response = await tmdbApi.get(`/tv/${showId}/season/${seasonNumber}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching season ${seasonNumber} for TV show ID ${showId}:`,
      error
    );
    throw new Error(
      `Failed to fetch season ${seasonNumber} for TV show ID ${showId}`
    );
  }
};

const getGenres = async () => {
  try {
    const response = await tmdbApi.get("/genre/tv/list");
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching TV genres:", error);
    throw new Error("Failed to fetch TV genres from TMDB");
  }
};

module.exports = {
  getPopularTVShows,
  getTopRatedTVShows,
  getOnAirTVShows,
  searchTVShows,
  getTVShowDetails,
  getTVShowSeason,
  getGenres,
};
