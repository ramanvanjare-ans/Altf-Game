

import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Link as LinkIcon, Check, RefreshCw } from 'lucide-react';
export default function ToolHome() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentUrls, setRecentUrls] = useState([]);

  
  const API_KEY = 'pk_Dy7D007YLpDLvNJD'; 
  const API_URL = 'https://api.short.io/links';

  
  useEffect(() => {
    const savedUrls = localStorage.getItem('recentShortUrls');
    if (savedUrls) {
      setRecentUrls(JSON.parse(savedUrls));
    }
  }, []);

 
  useEffect(() => {
    if (recentUrls.length > 0) {
      localStorage.setItem('recentShortUrls', JSON.stringify(recentUrls));
    }
  }, [recentUrls]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

   
    try {
      new URL(longUrl);
      const validProtocols = ['http:', 'https:','www.'];
      if (!validProtocols.some(protocol => longUrl.startsWith(protocol))) {
        setError('Please enter a valid URL (include http:// or https://)');
        return;
      } 
    } catch (error) {
       setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);
    setError('');
    setCopied(false);

    try {
     
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_KEY,
        },
        body: JSON.stringify({
          originalURL: longUrl,
          domain: 'short.io' 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL. Please try again.');
      }

      const data = await response.json();
      
      
      const shortened = data.shortURL || `https://short.io/${data.shortCode}`;
      setShortUrl(shortened);

      
      const newUrl = {
        original: longUrl,
        shortened: shortened,
        date: new Date().toLocaleDateString(),
        id: Date.now()
      };
      
      setRecentUrls(prev => [newUrl, ...prev.slice(0, 4)]); 

    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      
      
      
      const newUrl = {
        original: longUrl,
         shortened: shortUrl,
        date: new Date().toLocaleDateString(),
        id: Date.now()
      };
      setRecentUrls(prev => [newUrl, ...prev.slice(0, 4)]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setLongUrl('');
    setShortUrl('');
    setError('');
    setCopied(false);
  };

  const handleRedirect = (url) => {
    window.open(url, '_blank');
  };

  const handleClearHistory = () => {
    setRecentUrls([]);
    localStorage.removeItem('recentShortUrls');
  };

  return (
    <div className="min-h-screen bg-(--card) p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
       
          
            
            <h1 className="heading text-center pt-5 animate-fade-up">URL Shortener</h1>
         
          <p className="description text-center pt-2 animate-fade-up">Shorten your long URLs instantly and make them easy to share</p>
     

  
        <div className="bg-(--card) border border-(--border) rounded-2xl shadow-lg p-6 md:p-8 mb-8 mt-15">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="longUrl" className="block subheading mb-2">
                Enter Long URL
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="url"
                  id="longUrl"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://example.com/very-long-url-path"
                  className="flex-grow px-4 py-3 md:py-4 rounded-lg border border-(--border)  text-lg"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-(--primary) text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-5 h-5" />
                        Shorten URL
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="bg-red-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg font-medium text-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className=" text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Short URL Display */}
            {shortUrl && (
              <div className="mt-6 p-4 bg-(--card) border border-(--border) rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Your Short URL:</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRedirect(shortUrl)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600  text-white rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 bg-(--primary)  text-white rounded-lg transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              <div className="bg-(--card) p-3 rounded-lg break-all">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--primary)  hover:underline text-lg"
                  >
                    {shortUrl}
                  </a>
                </div>
              </div>
            )}
          </form>
        </div>

      
        {recentUrls.length > 0 && (
          <div className="bg-(--card) rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="subheading">Recent Shorted URLs</h2>
              <button
                onClick={handleClearHistory}
                className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
              >
                Clear History
              </button>
            </div>
            
            <div className="space-y-4">
              {recentUrls.map((url) => (
                <div
                  key={url.id}
                  className="bg-(--card) border border-(--border) rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-(--foreground) mb-1">Original URL</p>
                      <p className="truncate text-(--muted-foreground)">{url.original}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-(--foreground) mb-1">Short URL</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={url.shortened}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-(--primary) hover:underline truncate"
                        >
                          {url.shortened}
                        </a>
                        <button
                          onClick={() => navigator.clipboard.writeText(url.shortened)}
                          className="text-(--muted-foreground) hover:text-(--foreground) cursor-pointer transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-(--muted-foreground)">
                      {url.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

     
      </div>
    </div>
  );
};

