import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  Search,
  Copy,
  Share2,
  Smile,
  Image as ImageIcon,
  X,
  Check,
  Heart,
  Star,
  Trash2,
} from "lucide-react";

export default function ToolHome() {
  const [activeTab, setActiveTab] = useState("emoji");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentEmojis, setRecentEmojis] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const GIPHY_API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65"; // Demo API key

  // Load favorites and recent from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]",
    );
    const savedRecent = JSON.parse(
      localStorage.getItem("recentEmojis") || "[]",
    );
    setFavorites(savedFavorites);
    setRecentEmojis(savedRecent);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save recent emojis to localStorage
  useEffect(() => {
    localStorage.setItem("recentEmojis", JSON.stringify(recentEmojis));
  }, [recentEmojis]);

  // Fetch GIFs from Giphy
  useEffect(() => {
    if (activeTab === "gif") {
      fetchGifs(searchTerm || "trending");
    }
  }, [activeTab, searchTerm]);

  const fetchGifs = async (query) => {
    setLoading(true);
    try {
      const endpoint =
        query === "trending"
          ? `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20`
          : `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=20`;

      const response = await fetch(endpoint);
      const data = await response.json();
      setGifs(data.data);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
    addToRecent(emojiObject.emoji);
    setShowPicker(false);
  };

  const addToRecent = (emoji) => {
    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(
      0,
      20,
    );
    setRecentEmojis(updated);
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedItem(content);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareContent = async (content) => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: content,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyToClipboard(content);
    }
  };

  const toggleFavorite = (item) => {
    if (favorites.includes(item)) {
      setFavorites(favorites.filter((f) => f !== item));
    } else {
      setFavorites([...favorites, item]);
    }
  };

  const handleGifSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchGifs(searchTerm);
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      {/* <header className=" shadow-md sticky top-0 z-50"> */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-center pt-8 ">
          <h1 className="heading text-center animate-fade-up">
            Emoji & GIF Picker
          </h1>
          <p className="description px-3 animate-fade-up">
            Express yourself with emojis and GIFs
          </p>
        </div>


{/* emoji and gif Icons */}


        <div
          className="flex gap-2 p-1 rounded-lg pt-5 
                px-4 
                sm:px-6 
                md:px-12 
                lg:px-24 
                xl:px-48"
        >
          <button
            onClick={() => setActiveTab("emoji")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all border border(--border) animate-scale-in cursor-pointer ${
              activeTab === "emoji"
                ? "bg-white shadow-md text-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Smile className="w-4 h-4" />
            <span className="font-medium">Emojis</span>
          </button>
          <button
            onClick={() => setActiveTab("gif")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all border border(--border) cursor-pointer ${
              activeTab === "gif"
                ? "bg-white shadow-md text-pink-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="font-medium">GIFs</span>
          </button>
        </div>

        {/* <div className="flex flex-col md:flex-row items-center justify-between px-16 pt-5 ">
          
        </div> */}
      </div>
    

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 ">
        <div className="max-w-6xl mx-auto " >
          {/* Search Bar */}
          {activeTab === "gif" && (
            <form onSubmit={handleGifSearch} className="mb-6 flex items-center gap-5">
              <div className="relative ">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for GIFs..."
                  className="w-96 pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                />
                  
              </div>

              {/* <button className=" px-4 py-2.5 rounded-md transition-all border border-red-500 text-red-500  animate-scale-in cursor-pointer">
    Reset
   </button> */}
 



            </form>
          )}

          {/* Emoji Tab */}
          {activeTab === "emoji" && (
            <div className="space-y-6">
              {/* Selected Emoji Display */}
              {selectedEmoji && (
                <div className="bg-(--card) rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-6xl">{selectedEmoji}</div>
                      <div>
                        <h3 className="subheading">
                          Selected Emoji
                        </h3>
                        <p className="content">Ready to use</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavorite(selectedEmoji)}
                        className={`p-3 rounded-xl transition-all ${
                          favorites.includes(selectedEmoji)
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={
                            favorites.includes(selectedEmoji)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                      <button
                        onClick={() => copyToClipboard(selectedEmoji)}
                        className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                      >
                        {copiedItem === selectedEmoji ? (
                          <>
                            <Check className="w-5 h-5" />
                            <span className="font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            <span className="font-medium">Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => shareContent(selectedEmoji)}
                        className="flex items-center gap-2 px-4 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Favorites */}
              {favorites.length > 0 && (
                <div className="bg-(--card) rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                      />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Favorites
                      </h3>
                    </div>
                    <button
                      onClick={() => setFavorites([])}
                      className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                    {favorites.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedEmoji(emoji)}
                        className="text-3xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Emojis */}

              {/* {recentEmojis.length > 0 && (
                <div className="bg-(--card) rounded-2xl shadow-lg p-6">
                  <h3 className="subheading">
                    Recently Used
                  </h3>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                    {recentEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedEmoji(emoji)}
                        className="text-3xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Emoji Picker */}
              <div className="bg-(--card) rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="subheading">
                    Pick an Emoji
                  </h3>
                  <button
                    onClick={() => setShowPicker(!showPicker)}
                    className="md:hidden p-2 bg-purple-100 text-purple-600 rounded-lg"
                  >
                    {showPicker ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Smile className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className={`${showPicker || "hidden"} md:block`}>
                  <div className="flex justify-center ">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width="100%"
                      height="400px"
                      searchPlaceHolder="Search emojis..."
                      previewConfig={{
                        showPreview: false,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GIF Tab */}
          {activeTab === "gif" && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {gifs.map((gif) => (
                    <div
                      key={gif.id}
                      className=" rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={gif.images.fixed_height.url}
                          alt={gif.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-(--background) bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() =>
                              toggleFavorite(gif.images.fixed_height.url)
                            }
                            className={`p-3 rounded-full transition-all ${
                              favorites.includes(gif.images.fixed_height.url)
                                ? "bg-red-500 text-white"
                                : "bg-white text-gray-800"
                            }`}
                          >
                            <Heart
                              className="w-5 h-5"
                              fill={
                                favorites.includes(gif.images.fixed_height.url)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                          <button
                            onClick={() =>
                              copyToClipboard(gif.images.fixed_height.url)
                            }
                            className="p-3  rounded-full hover:bg-purple-100 transition-colors"
                          >
                            {copiedItem === gif.images.fixed_height.url ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5 text-gray-800" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              shareContent(gif.images.fixed_height.url)
                            }
                            className="p-3 bg- rounded-full hover:bg-pink-100 transition-colors"
                          >
                            <Share2 className="w-5 h-5 text-gray-800" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-600 truncate">
                          {gif.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

    

      {/* Copy Notification */}
      {copiedItem && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up z-50">
          <Check className="w-5 h-5" />
          <span className="font-medium">Copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}
