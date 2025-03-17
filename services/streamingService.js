const axios = require("axios");
const cheerio = require("cheerio");

const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    Referer: "https://www.google.com/",
  },
});

const getImdbId = async (tmdbId) => {
  try {
    const response = await axiosInstance.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      }
    );

    if (!response.data || !response.data.imdb_id) {
      throw new Error("IMDB ID not found in response");
    }

    return response.data.imdb_id;
  } catch (error) {
    console.error("Error fetching IMDB ID:", error.message);
    throw new Error("Failed to fetch IMDB ID");
  }
};

const getSuperEmbedUrl = async (imdbId) => {
  try {
    const response = await axiosInstance.get(
      `https://getsuperembed.link/?video_id=${imdbId}`,
      {
        timeout: 5000,
        validateStatus: function (status) {
          return status >= 200 && status < 500; 
        },
      }
    );

    if (!response.data) {
      return null;
    }

    const $ = cheerio.load(response.data);
    const iframeSrc = $("iframe").attr("src");

    if (!iframeSrc) {
      const match = response.data.match(/iframe src="([^"]+)"/);
      return match ? match[1] : null;
    }

    return iframeSrc;
  } catch (error) {
    console.error("Error fetching SuperEmbed URL:", error.message);
    return null;
  }
};

const getStreamingSources = async (tmdbId) => {
  if (!tmdbId) {
    throw new Error("Movie ID is required");
  }

  try {
    const imdbId = await getImdbId(tmdbId);

    if (!imdbId) {
      throw new Error("IMDB ID not found");
    }

    const sources = {
      vidsrc: `https://vidsrc.me/embed/${imdbId}/`,
      fsapi: `https://fsapi.xyz/movie/${imdbId}`,
      curtstream: `https://curtstream.com/movies/imdb/${imdbId}`,
      moviewp: `https://moviewp.com/se.php?video_id=${imdbId}`,
      apimdb: `https://v2.apimdb.net/e/movie/${imdbId}`,
      gomo: `https://gomo.to/movie/${imdbId}`,
      vidcloud: `https://vidcloud.stream/${imdbId}.html`,
      imdbId,
    };

    try {
      const superEmbedUrl = await getSuperEmbedUrl(imdbId);
      if (superEmbedUrl) {
        sources.superembed = superEmbedUrl;
      }
    } catch (error) {
      console.error("Error with SuperEmbed:", error.message);
    }

    return sources;
  } catch (error) {
    console.error("Error getting streaming sources:", error.message);
    throw new Error(error.message || "Failed to get streaming sources");
  }
};

module.exports = {
  getStreamingSources,
};
