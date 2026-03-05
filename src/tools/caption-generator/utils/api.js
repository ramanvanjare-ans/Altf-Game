export const generateCaptionsAPI = async (productName) => {
const MODEL_NAME = "gemini-2.5-flash";
const apiKey = "AIzaSyBlvkGvEeScD-reFBaiGjrs2Od3Rhh0lvI";

const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
contents: [{
parts: [{
text: `Generate 6 creative and catchy advertising captions for "${productName}". Make them diverse in style - include promotional, emotional, witty, and professional captions. Each caption should be concise (under 100 characters) and engaging. Return only the captions, numbered 1-6, one per line.`
}]
}]
})
});

if (!response.ok) {
const errorData = await response.json();
console.error("API Error Details:", errorData);
throw new Error(`API Error: ${response.status}`);
}

const data = await response.json();

if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
const text = data.candidates[0].content.parts[0].text;
const captionList = text
.split('\n')
.filter(line => line.trim())
.map(line => line.replace(/^\d+\.\s*/, '').trim())
.filter(line => line.length > 0);

return captionList;
}

throw new Error('Invalid API response');
};
