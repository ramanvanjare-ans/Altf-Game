import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/shared/ui/Button';

// Declare global types for Google Maps
// declare global {
//   interface Window {
//     google: any;
//   }
// }

// interface DomainData {
//   ip: string;
//   hostname: string;
//   city: string;
//   region: string;
//   country: string;
//   loc: string;
//   org: string;
//   postal: string;
//   timezone: string;
// }

export default function IPChecker() {
  const [domain, setDomain] = useState('');
  const [domainData, setDomainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidDomain, setIsValidDomain] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; 

  useEffect(() => {
    if (domainData && mapRef.current && mapLoaded) {
      const [lat, lng] = domainData.loc.split(',').map(Number);
      
      if ((window ).google && (window ).google.maps) {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter({ lat, lng });
        } else {
          mapInstanceRef.current = new (window ).google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: 12,
            styles: [
              {
                featureType: 'administrative',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#444444' }]
              },
              {
                featureType: 'landscape',
                elementType: 'all',
                stylers: [{ color: '#f2f2f2' }]
              },
              {
                featureType: 'poi',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'road',
                elementType: 'all',
                stylers: [{ saturation: -100 }, { lightness: 45 }]
              },
              {
                featureType: 'road.highway',
                elementType: 'all',
                stylers: [{ visibility: 'simplified' }]
              },
              {
                featureType: 'transit',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'water',
                elementType: 'all',
                stylers: [{ color: '#b3d1ff' }, { visibility: 'on' }]
              }
            ]
          });
        }

        new (window ).google.maps.Marker({
          position: { lat, lng },
          map: mapInstanceRef.current,
          title: domainData.ip,
          animation: (window).google.maps.Animation.DROP
        });
      }
    }
  }, [domainData, mapLoaded]);

  useEffect(() => {
    if (!(window).google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => setError('Failed to load Google Maps');
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  const isValidDomainFormat = (input) => {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}$/;
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return domainRegex.test(input) || ipRegex.test(input);
  };

  const checkDomain = async () => {
    if (!domain.trim()) {
      setError('Please enter a domain or IP address');
      return;
    }

    const valid = isValidDomainFormat(domain);
    setIsValidDomain(valid);

    if (!valid) {
      setError('Invalid domain or IP address format');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`https://ipinfo.io/${domain}/json`);
      setDomainData(response.data);
    } catch (err) {
      setError('Failed to fetch domain information. Please try again.');
      setDomainData(null);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDomain('');
    setDomainData(null);
    setError('');
    setIsValidDomain(null);
    mapInstanceRef.current = null;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkDomain();
    }
  };

  const calculateSecurityRisk = () => {
    if (!domainData) return { level: 'Unknown', score: 0, details: [] };
    
    const details = [];
    let score = 0;

    if (domainData.org && domainData.org.toLowerCase().includes('hosting')) {
      score += 30;
      details.push('Hosting provider detected - Potential for malicious content');
    }

    if (domainData.timezone) {
      const tz = domainData.timezone.toLowerCase();
      if (tz.includes('asia') || tz.includes('africa')) {
        score += 20;
        details.push('High risk region for cyber threats');
      }
    }

    if (domainData.hostname && domainData.hostname.includes('dynamic')) {
      score += 25;
      details.push('Dynamic IP address - Frequently changes');
    }

    if (!domainData.org) {
      score += 15;
      details.push('Organization information not available');
    }

    if (score < 20) return { level: 'Low', score, color: 'text-green-600', bg: 'bg-green-100', details: ['No significant security risks detected'] };
    if (score < 40) return { level: 'Medium', score, color: 'text-yellow-600', bg: 'bg-yellow-100', details: details.length > 0 ? details : ['Moderate security concerns'] };
    if (score < 60) return { level: 'High', score, color: 'text-orange-600', bg: 'bg-orange-100', details: details.length > 0 ? details : ['Significant security risks identified'] };
    return { level: 'Critical', score, color: 'text-red-600', bg: 'bg-red-100', details: details.length > 0 ? details : ['Severe security risks detected'] };
  };

  const securityRisk = calculateSecurityRisk();

  return (
    <div className="min-h-screen bg-(--background) p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
       
        <div className="text-center mb-8">
          <h1 className="heading text-center animate-fade-up pt-8 mb-3">
             IP Checker
          </h1>
          <p className="description text-center animate-fade-up pt-2">Check domain validity, IP information, location, and security risks</p>
           
        </div>

        {/* Search Section */}
        <div className="bg-(--card) rounded-xl p-4 md:p-6 mb-6 shadow-2xl border border-(--border)">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setIsValidDomain(null);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter domain (e.g., google.com) or IP address"
                className="w-full px-4 py-4 rounded-xl bg-(-card) text-(--muted-foreground) border border-(--border) placeholder-(--muted-foreground)  text-sm md:text-base"
              />
              {domain && isValidDomain !== null && (
                <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isValidDomain ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isValidDomain ? '✓ Valid' : '✗ Invalid'}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={checkDomain}
                disabled={loading}
                className="flex-1 md:flex-none px-6 py-4 bg-(--primary)
                 text-white font-bold rounded-md  duration-300 transform  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Checking...
                  </span>
                ) : ' Check'}
              </Button>
              <button
                onClick={resetForm}
                className="px-6 py-4 bg-red-600 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 shadow-lg"
              >
                ↺ Reset
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {domainData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: IP Address Details */}
            <div className="bg-(--card) border border-(--border) rounded-xl  shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  📍 IP Address Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">IP Address</span>
                  <span className="text-(--muted-foreground) font-mono font-bold">{domainData.ip}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Country</span>
                  <span className="text-(--muted-foreground)  flex items-center gap-1">
                    <span className="text-xl">{domainData.country ? `https://flagcdn.com/24x18/${domainData.country.toLowerCase()}.png` : '🏳️'}</span>
                    {domainData.country || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">City</span>
                  <span className="text-(--muted-foreground) font-bold">{domainData.city || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Region</span>
                  <span className="text-(--muted-foreground) font-bold">{domainData.region || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">ISP</span>
                  <span className="text-(--muted-foreground) font-bold text-xs truncate max-w-48" title={domainData.org}>{domainData.org || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-(--foreground) font-medium text-sm">Coordinates</span>
                  <span className="text-(--muted-foreground) font-mono font-bold text-xs">{domainData.loc || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Security Risk */}
            <div className="bg-(--card) rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="bg-linear-to-r from-red-500 to-orange-500 px-6 py-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  🔒 Security Risk Assessment
                </h2>
              </div>
              <div className="p-6">
                <div className={`${securityRisk.bg} rounded-xl p-6 text-center mb-6`}>
                  <div className={`text-4xl font-bold ${securityRisk.color}`}>
                    {securityRisk.level}
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-(--muted-foreground)">{securityRisk.score}/100</div>
                    <div className="w-full bg-green-100 rounded-full h-3 mt-2">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          securityRisk.level === 'Low' ? 'bg-green-500' :
                          securityRisk.level === 'Medium' ? 'bg-yellow-500' :
                          securityRisk.level === 'High' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${securityRisk.score}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-(--muted-foreground) font-semibold text-sm">Risk Details:</h3>
                  {securityRisk.details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-500 mt-0.5">⚠️</span>
                      <span className="text-(--muted-foreground)">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: IP Information */}
            <div className="bg-(--card) rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="bg-linear-to-r from-cyan-500 to-teal-500 px-6 py-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  ℹ️ IP Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Hostname</span>
                  <span className="text-(--muted-foreground) font-mono font-bold text-xs truncate max-w-40" title={domainData.hostname}>{domainData.hostname || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Postal Code</span>
                  <span className="text-(--muted-foreground) font-bold">{domainData.postal || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Timezone</span>
                  <span className="text-(--muted-foreground) font-bold text-sm">{domainData.timezone || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Local Time</span>
                  <span className="text-(--muted-foreground) font-bold">
                    {domainData.timezone ? new Date().toLocaleString('en-US', { timeZone: domainData.timezone }) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">IP Type</span>
                  <span className="text-(--muted-foreground) font-bold">{domainData.ip.includes(':') ? 'IPv6' : 'IPv4'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-(--foreground) font-medium text-sm">Network</span>
                  <span className="text-(--muted-foreground) font-bold text-xs truncate max-w-40">{domainData.org?.split(' ')[0] || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Card 4: Google Maps Location */}
            <div className="bg-(--card) rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 md:col-span-2 lg:col-span-2">
              <div className="bg-linear-to-r from-green-500 to-emerald-500 px-6 py-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  🗺️ Location on Google Maps
                </h2>
              </div>
              <div className="p-4">
                <div 
                  ref={mapRef}
                  className="w-full h-64 md:h-80 rounded-xl shadow-inner bg-(--card)"
                >
                  {!mapLoaded && (
                    <div className="w-full h-full flex items-center justify-center bg-(--card) text-(--foreground) rounded-xl">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-3"></div>
                        <p className="text-(--muted-foreground)">Loading map...</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 p-3 bg-(--card) rounded-xl">
                  <p className="text-(--muted-foreground) text-sm font-medium">
                    📍 <span className="font-bold">Approximate Location:</span> {domainData.city}, {domainData.region}, {domainData.country}
                  </p>
                  <p className="text-(--muted-foreground) text-xs mt-1">
                    Coordinates: {domainData.loc}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 5: Device & Network Info */}
            <div className="bg-(--card) rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="bg-linear-to-r from-purple-500 to-pink-500 px-6 py-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  💻 Device & Network Info
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Browser</span>
                  <span className="text-(--muted-foreground) font-bold text-sm">{navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Platform</span>
                  <span className="text-(--muted-foreground) font-bold text-sm">{navigator.platform || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Language</span>
                  <span className="text-(--muted-foreground) font-bold">{navigator.language || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Screen</span>
                  <span className="text-(--muted-foreground) font-bold">{`${window.screen.width}x${window.screen.height}`}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-(--border)">
                  <span className="text-(--foreground) font-medium text-sm">Color Depth</span>
                  <span className="text-(--muted-foreground) font-bold">{window.screen.colorDepth} bit</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-(--foreground) font-medium text-sm">Connection</span>
                  <span className="text-(--muted-foreground) font-bold capitalize">{(navigator ).connection?.effectiveType || 'Unknown'}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Empty State */}
        {!domainData && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🌍</div>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">No Domain Checked Yet</h2>
            <p className="text-(--muted-foreground) max-w-md mx-auto">
              Enter a domain name or IP address above to check its validity, location, and security risks.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-(--card) text-(--muted-foreground) rounded-full text-sm">Try: google.com</span>
              <span className="px-3 py-1 bg-(--card) text-(--muted-foreground) rounded-full text-sm">Try: 8.8.8.8</span>
              <span className="px-3 py-1 bg-(--card) text-(--muted-foreground) rounded-full text-sm">Try: github.com</span>
            </div>
          </div>
        )}

       
      </div>
    </div>
  );
};