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

const getTvImdbId = async (tmdbId) => {
  try {
    const response = await axiosInstance.get(
      `https://api.themoviedb.org/3/tv/${tmdbId}/external_ids`,
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
    console.error("Error fetching TV IMDB ID:", error.message);
    throw new Error("Failed to fetch TV IMDB ID");
  }
};

const getSuperEmbedUrl = async (imdbId, season = null, episode = null) => {
  try {
    let url = `https://getsuperembed.link/?video_id=${imdbId}`;

    if (season && episode) {
      url += `&season=${season}&episode=${episode}`;
    }

    const response = await axiosInstance.get(url, {
      timeout: 5000,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    });

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

const getStreamingSources = async (tmdbId, season = null, episode = null) => {
  if (!tmdbId) {
    throw new Error("TV Show ID is required");
  }

  try {
    const imdbId = await getTvImdbId(tmdbId);

    if (!imdbId) {
      throw new Error("IMDB ID not found");
    }

    const sources = {
      imdbId,
    };

    // Add sources for TV shows
    if (season && episode) {
      sources.vidsrc = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      sources.vidcloud = `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;

      try {
        const superEmbedUrl = await getSuperEmbedUrl(imdbId, season, episode);
        if (superEmbedUrl) {
          sources.superembed = superEmbedUrl;
        } else {
          sources.superembed = `https://multiembed.mov/directstream.php?video_id=${imdbId}&tmdb=1&s=${season}&e=${episode}`;
        }
      } catch (error) {
        console.error("Error with SuperEmbed:", error.message);
        sources.superembed = `https://multiembed.mov/directstream.php?video_id=${imdbId}&tmdb=1&s=${season}&e=${episode}`;
      }
    }
    // Add sources for entire TV show
    else {
      sources.vidsrc = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}`;
      sources.vidcloud = `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}`;

      try {
        const superEmbedUrl = await getSuperEmbedUrl(imdbId);
        if (superEmbedUrl) {
          sources.superembed = superEmbedUrl;
        } else {
          sources.superembed = `https://multiembed.mov/directstream.php?video_id=${imdbId}&tmdb=1`;
        }
      } catch (error) {
        console.error("Error with SuperEmbed:", error.message);
        sources.superembed = `https://multiembed.mov/directstream.php?video_id=${imdbId}&tmdb=1`;
      }
    }

    return sources;
  } catch (error) {
    console.error("Error getting TV streaming sources:", error.message);
    throw new Error(error.message || "Failed to get TV streaming sources");
  }
};

const getTvServers = async (tmdbId, season = null, episode = null) => {
  try {
    const sources = await getStreamingSources(tmdbId, season, episode);

    const servers = [
      {
        id: "vidsrc",
        name: "VidSrc",
        status: sources.vidsrc ? "online" : "offline",
      },
      {
        id: "superembed",
        name: "SuperEmbed",
        status: sources.superembed ? "online" : "offline",
      },
      {
        id: "vidcloud",
        name: "VidCloud",
        status: sources.vidcloud ? "online" : "offline",
      },
    ];

    return servers;
  } catch (error) {
    console.error("Error getting TV servers:", error.message);
    throw new Error("Failed to get TV server status");
  }
};

module.exports = {
  getStreamingSources,
  getTvServers,
};
