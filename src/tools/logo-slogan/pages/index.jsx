

import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, RefreshCw, Copy, Check, TrendingUp, Target, Lightbulb } from 'lucide-react';

export default function toolHome(){
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [tone, setTone] = useState('professional');
  const [slogans, setSlogans] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState('');

  // Industry options
  const industries = [
    'Technology', 'Fashion', 'Food & Beverage', 'Healthcare', 
    'Finance', 'Education', 'Entertainment', 'Automotive',
    'Real Estate', 'Fitness', 'Beauty', 'Travel', 'E-commerce'
  ];

 
  const tones = [
    { value: 'professional', label: 'Professional', icon: Target },
    { value: 'playful', label: 'Playful', icon: Sparkles },
    { value: 'bold', label: 'Bold', icon: Zap },
    { value: 'inspirational', label: 'Inspirational', icon: Lightbulb },
    { value: 'modern', label: 'Modern', icon: TrendingUp }
  ];


const  ANTHROPIC_API_KEY =""




  const generateSlogans = async () => {
    if (!brandName.trim()) {
      setError('Please enter a brand name');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSlogans([]);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'x-api-key': ANTHROPIC_API_KEY ,

        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Generate 6 creative and catchy slogans for a brand called "${brandName}"${industry ? ` in the ${industry} industry` : ''}. The tone should be ${tone}. 
            
Return ONLY a JSON array of strings, no markdown, no explanation, just the array. Example format:
["Slogan 1", "Slogan 2", "Slogan 3", "Slogan 4", "Slogan 5", "Slogan 6"]

Make each slogan unique, memorable, and brand-appropriate. Vary the length and style.`
          }]
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0]) {
        const text = data.content[0].text.trim();
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsedSlogans = JSON.parse(cleanedText);
        
      // generated slogan
        parsedSlogans.forEach((slogan, index) => {
          setTimeout(() => {
            setSlogans(prev => [...prev, slogan]);
          }, index * 150);
        });
      }
    } catch (err) {
      console.error('Error generating slogans:', err);
      setError('Failed to generate slogans. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };


  

  return (
    <div className="min-h-screen bg-(--background) relative overflow-hidden">
    

      {/* Grain texture overlay */}
      

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 text-(--primary) border border(--primary) rounded-full px-6 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-(--primary)" />
            <span className="text-(--primary) aniate-fade-up">AI-Powered Creativity</span>
          </div>
          <h1 className="heading mb-6 animate-fade-up ">
            SLogan Generator
          </h1>
          <p className=" description mx-auto font-light animate-fade-up">
            Transform your brand into unforgettable words. Real-time<br/> AI magic at your fingertips.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-(--card)  rounded-2xl p-6 md:p-8 border border-(--border) shadow-2xl">
              <h2 className="text-2xl font-bold text-(--foreground) mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-400" />
                Brand Details
              </h2>

              {/* Brand Name Input */}
              <div className="mb-6">
                <label className="block content mb-2">
                  BRAND NAME *
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand name..."
                  className="w-full bg- border border-(--border) rounded-md px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2  transition-all duration-300 text-lg backdrop-blur-sm"
                />
              </div>

              {/* Industry Select */}
              <div className="mb-6">
                <label className="block content mb-2">
                  INDUSTRY
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-(--card) border border-(--border) rounded-md px-5 py-4 text-(--foreground) focus:outline-none focus:ring-2  transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a78bfa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5rem'
                  }}
                >
                  <option value="">Select industry...</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind} className="bg-(--card) text-(--foreground)">{ind}</option>
                  ))}
                </select>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block content mb-2">
                  TONE
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {tones.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTone(value)}
                      className={`relative px-4 py-3 rounded-md font-medium transition-all cursor-pointer duration-300 ${
                        tone === value
                          ? 'bg-(--card) text-(--foreground) shadow-lg shadow-blue-500/30 scale-105'
                          : 'bg-(--card) text-(--foreground) border border-(--border)'
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateSlogans}
                disabled={isGenerating || !brandName.trim()}
                className="w-full mt-8 bg-(--primary)  text-white font-bold py-4 rounded-md transition-all duration-300 flex items-center justify-center gap-3 shadow-xl cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating......
                  </>
                ) : (
                  <>
                    
                    Generate 
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <div className="bg-(--card) rounded-xl p-6 md:p-8 border border-white/10 shadow-2xl min-h-125 lg:min-h-150">
              <h2 className="subheading mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 heading" />
                Generated Slogans
              </h2>

              {slogans.length === 0 && !isGenerating && (
                <div className="flex flex-col items-center justify-center h-100 text-center">
                  <div className="w-24 h-24 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                    <Sparkles className="w-12 h-12 text-blue-400" />
                  </div>
                  <p className="text-(--muted-foreground) text-lg mb-2">Start typing your brand name</p>
                  <p className="text-(--muted-foreground) text-sm">Slogans will appear automatically as you type</p>
                </div>
              )}

              <div className="space-y-4">
                {slogans.map((slogan, index) => (
                  <div
                    key={index}
                    className="group bg-(--card)   border border-(--border)  rounded-xl p-5 transition-all duration-300 hover:shadow-lg animate-fade"
                    
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-(--card) flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-(--foreground) text-lg md:text-xl font-medium leading-relaxed">
                            {slogan}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(slogan, index)}
                        className="shrink-0 p-2 rounded-lg bg-(--card)  transition-all duration-200 group-hover:scale-110" 
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {isGenerating && slogans.length < 6 && (
                <div className="space-y-4 mt-4">
                  {[...Array(6 - slogans.length)].map((_, i) => (
                    <div key={i} className="bg-(--card) border border-(-border) rounded-xl p-5 animate-pulse">
                      <div className="h-6 bg-(--card) rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

       
      </div>

      
    </div>
  );
};

