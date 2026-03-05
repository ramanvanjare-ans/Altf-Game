/**
 * Copies text to the clipboard with a fallback mechanism.
 * @param {string} text - The text content to copy.
 */
export const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard successfully.");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        // Fallback for older browsers or restricted environments
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          console.log("Text copied via execCommand.");
        } catch (err) {
          console.error("Fallback copy failed: ", err);
        }
        document.body.removeChild(textarea);
      });
  } else {
    console.error("Clipboard API not available.");
    // Fallback for older browsers or restricted environments
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("Text copied via execCommand.");
    } catch (err) {
      console.error("Fallback copy failed: ", err);
    }
    document.body.removeChild(textarea);
  }
};
