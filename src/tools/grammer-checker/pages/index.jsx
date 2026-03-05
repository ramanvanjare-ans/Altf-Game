import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, FileText, Zap, BookOpen, Globe, Code } from 'lucide-react';

   export default function ToolHome(){
  const [text, setText] = useState('');
  const [errors, setErrors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [useLanguageTool, setUseLanguageTool] = useState(true);
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    readability: 0
  });

  // Comprehensive validation rules
  const validationRules = [
    {
      name: 'Repeated Words',
      pattern: /\b(\w+)\s+\1\b/gi,
      message: 'Repeated word detected',
      suggestion: (match) => match.split(/\s+/)[0]
    },
    {
      name: 'Extra Spaces',
      pattern: /\s{2,}/g,
      message: 'Multiple spaces detected',
      suggestion: () => ' '
    },
    {
      name: 'Space Before Punctuation',
      pattern: /\s+([.,;:!?])/g,
      message: 'Space before punctuation',
      suggestion: (match) => match.trim()
    },
    {
      name: 'Missing Space After Punctuation',
      pattern: /([.,;:!?])([A-Za-z])/g,
      message: 'Missing space after punctuation',
      suggestion: (match) => match[0] + ' ' + match[1]
    },
    {
      name: 'Capitalization at Sentence Start',
      pattern: /(^|[.!?]\s+)([a-z])/g,
      message: 'Sentence should start with capital letter',
      suggestion: (match, p1, p2) => p1 + p2.toUpperCase()
    },
    {
      name: 'Multiple Exclamation/Question Marks',
      pattern: /[!?]{2,}/g,
      message: 'Excessive punctuation',
      suggestion: (match) => match[0]
    },
    {
      name: "It's vs Its",
      pattern: /\b(its|it's)\b/gi,
      message: "Check if you mean possessive 'its' or contraction 'it's'",
      suggestion: (match) => match.toLowerCase() === 'its' ? "it's (it is/has)" : "its (possessive)"
    },
    {
      name: 'Their/There/They\'re',
      pattern: /\b(their|there|they're|theyre)\b/gi,
      message: 'Verify correct usage of their/there/they\'re',
      suggestion: (match) => {
        const lower = match.toLowerCase();
        if (lower === 'their') return 'there/they\'re';
        if (lower === 'there') return 'their/they\'re';
        return 'their/there';
      }
    },
    {
      name: 'Your/You\'re',
      pattern: /\b(your|you're|youre)\b/gi,
      message: 'Check if you mean possessive \'your\' or contraction \'you\'re\'',
      suggestion: (match) => match.toLowerCase() === 'your' ? "you're (you are)" : "your (possessive)"
    },
    {
      name: 'Affect vs Effect',
      pattern: /\b(affect|effect)\b/gi,
      message: 'Verify correct usage (affect=verb, effect=noun)',
      suggestion: (match) => match.toLowerCase() === 'affect' ? 'effect (noun)' : 'affect (verb)'
    },
    {
      name: 'A vs An',
      pattern: /\ba\s+([aeiou])/gi,
      message: 'Should use "an" before vowel sound',
      suggestion: (match, vowel) => 'an ' + vowel
    },
    {
      name: 'An vs A',
      pattern: /\ban\s+([^aeiou])/gi,
      message: 'Should use "a" before consonant sound',
      suggestion: (match, consonant) => 'a ' + consonant
    },
    {
      name: 'Double Negatives',
      pattern: /\b(don't|doesn't|didn't|won't|wouldn't|can't|couldn't)\s+\w*\s+(no|nothing|nobody|never|none)\b/gi,
      message: 'Double negative detected',
      suggestion: () => 'Use single negative'
    },
    {
      name: 'Comma Splice',
      pattern: /[a-z]+,\s*[a-z]+\s+(is|are|was|were|has|have|will|would|can|could)/gi,
      message: 'Possible comma splice - consider using semicolon or period',
      suggestion: () => 'Use period or semicolon'
    },
    {
      name: 'Missing Apostrophe in Contractions',
      pattern: /\b(dont|doesnt|didnt|wont|wouldnt|cant|couldnt|isnt|arent|wasnt|werent|hasnt|havent|hadnt|shouldnt|youre|theyre|weve|ive|thats|whats)\b/gi,
      message: 'Missing apostrophe in contraction',
      suggestion: (match) => {
        const contractions = {
          'dont': "don't", 'doesnt': "doesn't", 'didnt': "didn't",
          'wont': "won't", 'wouldnt': "wouldn't", 'cant': "can't",
          'couldnt': "couldn't", 'isnt': "isn't", 'arent': "aren't",
          'wasnt': "wasn't", 'werent': "weren't", 'hasnt': "hasn't",
          'havent': "haven't", 'hadnt': "hadn't", 'shouldnt': "shouldn't",
          'youre': "you're", 'theyre': "they're", 'weve': "we've",
          'ive': "I've", 'thats': "that's", 'whats': "what's"
        };
        return contractions[match.toLowerCase()] || match;
      }
    },
    {
      name: 'Redundant Phrases',
      pattern: /\b(very unique|more unique|most unique|absolutely essential|completely filled|totally destroyed|past history|future plans|end result|final outcome|added bonus|unexpected surprise|free gift)\b/gi,
      message: 'Redundant phrase detected',
      suggestion: (match) => {
        const redundant = {
          'very unique': 'unique',
          'more unique': 'unique',
          'most unique': 'unique',
          'absolutely essential': 'essential',
          'completely filled': 'filled',
          'totally destroyed': 'destroyed',
          'past history': 'history',
          'future plans': 'plans',
          'end result': 'result',
          'final outcome': 'outcome',
          'added bonus': 'bonus',
          'unexpected surprise': 'surprise',
          'free gift': 'gift'
        };
        return redundant[match.toLowerCase()] || match;
      }
    }
  ];

  const checkWithLanguageTool = async (textToCheck) => {
    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: textToCheck,
          language: 'en-US',
          enabledOnly: 'false'
        })
      });

      if (!response.ok) {
        throw new Error('LanguageTool API request failed');
      }

      const data = await response.json();
      return data.matches || [];
    } catch (error) {
      console.error('LanguageTool API Error:', error);
      return [];
    }
  };

  const checkGrammar = async () => {
    setIsChecking(true);
    const foundErrors = [];
    const foundSuggestions = [];

    // Local validation rules
    validationRules.forEach(rule => {
      let match;
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      
      while ((match = regex.exec(text)) !== null) {
        const errorText = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + errorText.length;
        
        foundErrors.push({
          type: rule.name,
          message: rule.message,
          start: startIndex,
          end: endIndex,
          text: errorText,
          source: 'Local'
        });

        foundSuggestions.push({
          start: startIndex,
          end: endIndex,
          original: errorText,
          suggestion: typeof rule.suggestion === 'function' 
            ? rule.suggestion(errorText, ...match.slice(1))
            : rule.suggestion,
          source: 'Local'
        });
      }
    });

    // LanguageTool API validation
    if (useLanguageTool && text.trim()) {
      const ltMatches = await checkWithLanguageTool(text);
      
      ltMatches.forEach((match, idx) => {
        const errorText = text.substring(match.offset, match.offset + match.length);
        
        // Avoid duplicate errors (check if same position already has error)
        const isDuplicate = foundErrors.some(err => 
          err.start === match.offset && err.end === match.offset + match.length
        );

        if (!isDuplicate) {
          foundErrors.push({
            type: match.rule.category.name || 'Grammar',
            message: match.message,
            start: match.offset,
            end: match.offset + match.length,
            text: errorText,
            source: 'LanguageTool'
          });

          if (match.replacements && match.replacements.length > 0) {
            foundSuggestions.push({
              start: match.offset,
              end: match.offset + match.length,
              original: errorText,
              suggestion: match.replacements[0].value,
              allSuggestions: match.replacements.map(r => r.value),
              source: 'LanguageTool'
            });
          }
        }
      });
    }

    // Sort by position
    foundErrors.sort((a, b) => a.start - b.start);
    foundSuggestions.sort((a, b) => a.start - b.start);

    setErrors(foundErrors);
    setSuggestions(foundSuggestions);
    calculateStats(text);
    setIsChecking(false);
  };

  const calculateStats = (content) => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const characters = content.length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    const avgWordsPerSentence = words / (sentences || 1);
    const avgSyllablesPerWord = 1.5;
    const readability = Math.max(0, Math.min(100, 
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
    ));

    setStats({ words, characters, sentences, readability: Math.round(readability) });
  };

  const applySuggestion = (suggestion) => {
    const newText = text.slice(0, suggestion.start) + 
                    suggestion.suggestion + 
                    text.slice(suggestion.end);
    setText(newText);
  };

  const renderHighlightedText = () => {
    if (errors.length === 0) {
      return <div className="text-gray-700 whitespace-pre-wrap">{text || 'Start typing to check grammar...'}</div>;
    }

    const parts = [];
    let lastIndex = 0;
    const sortedErrors = [...errors].sort((a, b) => a.start - b.start);

    sortedErrors.forEach((error, idx) => {
      if (error.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`} className="text-gray-700">
            {text.slice(lastIndex, error.start)}
          </span>
        );
      }

      parts.push(
        <span
          key={`error-${idx}`}
          className="bg-red-100 border-b-2 border-red-500 cursor-pointer relative group"
          title={error.message}
        >
          {error.text}
          <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 max-w-xs">
            <div className="font-semibold">{error.type}</div>
            <div>{error.message}</div>
            <div className="text-gray-300 text-[10px] mt-1">Source: {error.source}</div>
          </span>
        </span>
      );

      lastIndex = error.end;
    });

    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end" className="text-gray-700">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return <div className="whitespace-pre-wrap">{parts}</div>;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text) {
        checkGrammar();
      } else {
        setErrors([]);
        setSuggestions([]);
        setStats({ words: 0, characters: 0, sentences: 0, readability: 0 });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [text, useLanguageTool]);

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="  ">
        <div className="max-w-6xl mx-auto">
          <div className=" items-center gap-3 mb-2">
           
            <h1 className="heading text-center pt-8 animate-fade-up" >Grammar Checker</h1>
             <p className="description text-center animate-fade-up">
           Check  grammar, spelling, punctuation, and verbs issues in <br/>your text.
          </p>
          </div>
         
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 border border-(--border) rounded-xl mb-4 mt-12 ">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-(--card)  text-(--muted-foreground) rounded-lg p-4 animate-shake-x ">
            <div className="subheading">Words</div>
            <div className="description">{stats.words}</div>
          </div>
          <div className="bg-(--card)  rounded-lg p-4">
            <div className="subheading">Characters</div>
            <div className="description">{stats.characters}</div>
          </div>
          <div className="bg-(--card)  rounded-lg p-4">
            <div className="subheading">Sentences</div>
            <div className="description">{stats.sentences}</div>
          </div>
          <div className="bg-(--card)  rounded-lg p-4">
            <div className="subheading">Readability</div>
            <div className="description">{stats.readability}%</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="md:col-span-2">
            <div className="bg-(--card) border-2 border-(--border) text-(--foreground) rounded-lg shadow-sm">
              <div className="border-b border-(--border) text-(--foreground) px-4 py-3 flex items-center justify-between flex-wrap gap-3">
                <h2 className="subheading flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Your Text
                </h2>
                <div className="flex items-center gap-4">
                  
                  {errors.length > 0 && (
                    <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                      <AlertCircle className="w-4 h-4" />
                      {errors.length} {errors.length === 1 ? 'issue' : 'issues'}
                    </span>
                  )}
                  {errors.length === 0 && text && !isChecking && (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      No issues
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative bg-(--card) ">
                <textarea
                type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-96 p-4 text-(--foreground) resize-none focus:outline-none font-mono text-sm opacity-0 absolute top-0 left-0"
                  placeholder="Start typing or paste your text here..."
                  
                />
                <div className="w-full h-96 p-4 overflow-auto font-mono text-sm">
                  {renderHighlightedText()}
                </div>
              </div>

              <div className="border-t border-gray-200 bg-(--card) px-4 py-3">
                <button
                  onClick={checkGrammar}
                  disabled={isChecking || !text}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  {isChecking ? 'Checking...' : 'Check Grammar'}
                </button>
              </div>
            </div>
          </div>

          {/* Suggestions Panel */}
          <div className="md:col-span-1 ">
            <div className=" border-2 border-(--border) rounded-lg shadow-sm sticky top-4">
              <div className="border-b border-(--border) bg-(--)card px-4 py-3">
                <h2 className="subheafing">Suggestions</h2>
              </div>
              
              <div className="max-h-125 overflow-y-auto p-4">
                {isChecking ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm">Checking grammar...</p>
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No suggestions yet</p>
                    <p className="text-xs mt-1">Start typing to see suggestions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suggestions.map((suggestion, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start gap-2 mb-2">
                          {suggestion.source === 'LanguageTool' ? (
                            <Globe className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          ) : (
                            <Code className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {errors[idx]?.type}
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              {errors[idx]?.message}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              Source: {suggestion.source}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="bg-red-50 border border-red-200 rounded px-2 py-1">
                            <div className="text-xs text-red-700 font-medium mb-0.5">Original:</div>
                            <div className="text-sm text-red-900 font-mono wrap-break-words">
                              {suggestion.original}
                            </div>
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded px-2 py-1">
                            <div className="text-xs text-green-700 font-medium mb-0.5">Suggested:</div>
                            <div className="text-sm text-green-900 font-mono wrap-break-words">
                              {suggestion.suggestion}
                            </div>
                          </div>

                          {suggestion.allSuggestions && suggestion.allSuggestions.length > 1 && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                                +{suggestion.allSuggestions.length - 1} more options
                              </summary>
                              <div className="mt-2 space-y-1">
                                {suggestion.allSuggestions.slice(1, 4).map((alt, i) => (
                                  <div key={i} className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">
                                    {alt}
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>

                        <button
                          onClick={() => applySuggestion(suggestion)}
                          className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded font-medium transition-colors"
                        >
                          Apply Suggestion
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
};

