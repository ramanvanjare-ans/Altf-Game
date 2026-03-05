export const demoApps = [
{
title: "Instagram",
snippet: "Photo & Video sharing app with Stories, Reels and messaging. Connect with friends and share your moments.",
link: "https://apps.apple.com/app/instagram/id389801252"
},
{
title: "Spotify",
snippet: "Music streaming with playlists, podcasts & offline listening. Enjoy millions of songs and podcasts.",
link: "https://apps.apple.com/app/spotify-music/id324684580"
},
{
title: "Snapchat",
snippet: "Share short-lived snaps, chat and creative AR filters. Stay connected with friends through fun snaps.",
link: "https://apps.apple.com/app/snapchat/id447188370"
},
{
title: "TikTok",
snippet: "Create and discover short-form videos. Join millions of creators and trending challenges.",
link: "https://apps.apple.com/app/tiktok/id835599320"
},
{
title: "WhatsApp",
snippet: "Simple, reliable messaging and calling. Connect with family and friends for free.",
link: "https://apps.apple.com/app/whatsapp-messenger/id310633997"
},
{
title: "Netflix",
snippet: "Watch movies, series, and documentaries. Stream unlimited entertainment on any device.",
link: "https://apps.apple.com/app/netflix/id363590051"
}
];

export const fetchApps = async (query) => {
const res = await fetch(
`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=software&limit=12`
);
const data = await res.json();
return (data.results || []).map((app) => ({
title: app.trackName,
snippet: app.description,
link: app.trackViewUrl
}));
};

