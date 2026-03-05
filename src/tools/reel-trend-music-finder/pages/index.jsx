import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  TrendingUp,
  Users,
  Clock,
  Play,
  Flame,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/shared/ui/Button";

const SPOTIFY_CLIENT_ID = "your_client_id_here";
const SPOTIFY_CLIENT_SECRET = "your_client_secret_here";

export default function ToolHome() {
  const [accessToken, setAccessToken] = useState(null);
  const [allTracks, setAllTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    trackCount: 0,
    artistCount: 0,
    lastUpdate: "--:--",
  });

 
  const getAccessToken = async () => {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
        },
        body: "grant_type=client_credentials",
      });

      const data = await response.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
        return data.access_token;
      }
    } catch (error) {
      console.error("Failed to get access token:", error);
    }
  };


  const loadTrendingMusic = async (token) => {
    setLoading(true);
    try {
      const playlistIds = [
        "37i9dQZEVXbMDoHDwVN2tF",
        "37i9dQZEVXbLiRSasKsNU9",
        "37i9dQZEVXbNG2KDcFcKOF",
      ];

      const tracks = new Set();
      const trackDetails = [];

      for (const playlistId of playlistIds) {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (data.items) {
          data.items.forEach((item) => {
            if (item.track && !tracks.has(item.track.id)) {
              tracks.add(item.track.id);
              trackDetails.push({
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists.map((a) => a.name).join(", "),
                album: item.track.album.name,
                image: item.track.album.images[0]?.url || "",
                popularity: item.track.popularity,
                previewUrl: item.track.preview_url,
                externalUrl: item.track.external_urls.spotify,
                duration: item.track.duration_ms,
              });
            }
          });
        }
      }

      const sortedTracks = trackDetails.sort(
        (a, b) => b.popularity - a.popularity,
      );
      setAllTracks(sortedTracks);
      setFilteredTracks(sortedTracks);

      const uniqueArtists = new Set(sortedTracks.map((t) => t.artist)).size;
      setStats({
        trackCount: sortedTracks.length,
        artistCount: uniqueArtists,
        lastUpdate: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      setLoading(false);
    } catch (error) {
      console.error("Error loading music:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = await getAccessToken();
      if (token) {
        await loadTrendingMusic(token);
      }
    };
    init();

    const interval = setInterval(() => {
      if (accessToken) {
        loadTrendingMusic(accessToken);
      }
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  // Search bar handler

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    let filtered = allTracks.filter(
      (track) =>
        track.name.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.album.toLowerCase().includes(query),
    );

    //filter section
    if (activeFilter === "viral") {
      filtered = filtered.filter((t) => t.popularity > 80);
    } else if (activeFilter === "rising") {
      filtered = filtered.filter(
        (t) => t.popularity > 60 && t.popularity <= 80,
      );
    } else if (activeFilter === "trending") {
      filtered = filtered.filter((t) => t.popularity <= 60);
    }

    setFilteredTracks(filtered);
  }, [searchQuery, activeFilter, allTracks]);

  const handleRefresh = async () => {
    if (accessToken) {
      await loadTrendingMusic(accessToken);
    }
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "viral", label: "Viral" },
    { id: "rising", label: "Rising" },
    { id: "trending", label: "Trending" },
  ];

  return (
    <div className="min-h-screen bg-(--background)">
      
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-5">

          <h1 className=" heading text-center">Trend Music </h1>
          <p className="description text-center">Find the best music for your Reel Trend</p>
          </div>

          {/* <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 mt-8"> */}
           

             {/*Search bar  */}

            {/* <div className="  flex relative  bg-red-500 w-full lg:max-w-md item-center justify-center">
              <div className="">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--muted-foreground)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trending music..."
                className="w-full pl-12 pr-4 py-3 border border-(--border) rounded-md text-(--foreground) transition-all font-medium"
              />
</div>
            
              <Button>
                      Search
              </Button>
             
            </div> */}

            {/* Refresh Button */}
            {/* <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-6 py-3  text-white rounded-md font-bold "
            >
              <RefreshCw className="w-5 h-5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div> */}

        <div className="m-8  shadow-md p-4 sm:p-6 mb-6 ">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 ml-96">
                    <div className="relative ml-8">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2  text-(--foreground) w-5 h-5" />
                      <div
                        className="
            relative
            w-full
            rounded-lg
            border-2
            border-(--border)"
                      >
                        <input
                         type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trending music..."
                className="w-full pl-12 pr-4 py-3 border border-(--border) rounded-md text-(--foreground) transition-all font-medium"
                        />
                      </div>




                    </div>

                     <Button
              onClick={handleRefresh}
              className="flex items-center w-32 gap-2 px-6 py-3 cursor-pointer  text-white rounded-md font-bold "
            >
              {/* <RefreshCw className="w-5 h-5" /> */}
              <span className="hidden sm:inline">Search</span>
            </Button> 
        
                </div>    
                










     

      <main className="  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8  item-center pt-16">
          
          <div className="bg-(--card) border-2 border-(--border) rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-red-500" />
              <span className="subheading">
                Trending Tracks
              </span>
            </div>
            <div className="content">
              {stats.trackCount}
            </div>
          </div>

          <div className="bg-(--card) border border-(--border) rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-(--primary)" />
              <span className="text-sm font-semibold text-(--muted-foreground)">
                Active Artists
              </span>
            </div>
            <div className="text-4xl font-black text-(--foreground)">
              {stats.artistCount}
            </div>
          </div>

          {/* <div className="bg-(--card) border border-(--border) rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-pink-500" />
              <span className="text-sm font-semibold text-gray-600">
                Last Updated
              </span>
            </div>
            <div className="text-2xl font-black text-black">
              {stats.lastUpdate}
            </div>
          </div> */}

        </div>

        {/* Section Header with Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-16">
          <h2 className="subheading">
            🔥 Trending Now
          </h2>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm cursor-pointer transition-all ${
                  activeFilter === filter.id
                    ? "bg-(--primary) text-white shadow-lg scale-105"
                    : "bg-(--card) text-(--foreground) border-2 border-(--border) "
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Music Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-black border-t-red-500 rounded-full animate-spin mb-4"></div>
            <p className="text-black font-semibold">
              Loading trending music...
            </p>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4 opacity-20">🎵</div>
            <h3 className="text-2xl font-black text-(--foreground) mb-2">
              No tracks found
            </h3>
            <p className="text-(--muted-foreground)">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTracks.map((track, index) => (
              <div
                key={track.id}
                className="bg-(--card) border-2 border-(--border) rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group animate-fade-in"
                
              >
                {/* Album Art */}
                <div className="relative aspect-square overflow-hidden bg-(--card) roundeed-xl">
                  <img
                    src={track.image || "no image found"}
                    alt={track.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Trending Badge */}
                  {track.popularity > 80 && (
                    <div className="absolute top-3 left-3 bg-(--card) text-(--foreground) px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                      <Flame className="w-3 h-3" />
                      Viral
                    </div>
                  )}
                  {track.popularity > 60 && track.popularity <= 80 && (
                    <div className="absolute top-3 left-3 bg-(--card) text-(--foreground) px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                      <ArrowUp className="w-3 h-3" />
                      Rising
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="p-5">
                  <h3 className="font-black text-lg text-(--foreground)mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                    {track.name}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium mb-4 line-clamp-1">
                    {track.artist}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">📊</span>
                      <span className="font-bold text-black">
                        {track.popularity}%
                      </span>
                    </div>

                    <button
                      onClick={() => window.open(track.externalUrl, "_blank")}
                      className="w-11 h-11 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
                    >
                      <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>

    </div>
    
  );
}
