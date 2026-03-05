import { removeBackground } from "@imgly/background-removal";
import { useEffect, useState } from "react";


export default function ToolHome(){
  const [originalImage, setOriginalImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (resultImage) URL.revokeObjectURL(resultImage);
    };
  }, []);

  const processImage = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    if (file.size > 10 * 1024 * 1024) {
      // 10 MB limit
      alert("File is too large! Max 10 MB.");
      return;
    }

    if (originalImage) URL.revokeObjectURL(originalImage);
    if (resultImage) URL.revokeObjectURL(resultImage);

    setResultImage(null);
    setIsLoading(true);

    const originalUrl = URL.createObjectURL(file);
    setOriginalImage(originalUrl);

    try {
      const resultBlob = await removeBackground(file);
      const resultUrl = URL.createObjectURL(resultBlob);
      setResultImage(resultUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to remove background");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    processImage(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processImage(file);
  };

  const handleReset = () => {
  setOriginalImage(null);
  setResultImage(null);
  setIsLoading(false);
};

  return (
    <main className="min-h-screen bg-(--background) text-(--foreground) px-4 py-6">
  <div className="max-w-7xl mx-auto">

    {/* Header */}
    <header className="text-center mb-12 pt-12">
      <h1 className="heading animate-fade-up">
        Background Remover
      </h1>
      <p className="description animate-fade-up mt-2">
        Upload an image and remove the background instantly.
      </p>
    </header>

    {/* Upload Card */}
    <div className="flex justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-(--border) bg-(--card) p-6 shadow-lg animate-fade-up">

        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-(--border)"
          }`}
        >
          <p className="text-lg font-semibold mb-2">
            Drag & drop your image here
          </p>
          <p className="text-sm text-(--muted-foreground) mb-4">
            or select an image from your device
          </p>

          <label className="inline-flex items-center justify-center cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-xl font-semibold text-sm sm:text-base text-white">
            Select Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </section>

        {/* Loading */}
        {isLoading && (
          <div className="text-center mt-6">
            <p className="text-base font-medium animate-pulse">
              Removing background...
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Preview Section */}
    {(originalImage || resultImage) && (
      <section className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Original */}
        {originalImage && (
          <div className="rounded-2xl bg-(--card) border border-(--border) p-6 text-center shadow-md">
            <p className="mb-4 font-semibold">Original Image</p>
            <div className="rounded-xl overflow-hidden  bg-size-[20px_20px]">
              <img
                src={originalImage}
                alt="Original"
                className="mx-auto max-h-96 object-contain"
              />
            </div>
          </div>
        )}

        {/* Result */}
        {resultImage && (
          <div className="rounded-2xl bg-(--card) border border-(--border) p-6 text-center shadow-md ">
            <p className="mb-4 font-semibold">After Remove Background</p>
            <div className="rounded-xl overflow-hidden  bg-size-[20px_20px] gap-5">
              <img
                src={resultImage}
                alt="Result"
                className="mx-auto max-h-96 object-contain"
              />
            </div>

            <a
              href={resultImage}
              download="background-removed.png"
              className="inline-flex items-center justify-center mt-6 bg-(--primary)  transition-colors  px-6 py-2 rounded-md font-semibold text-sm sm:text-base text-white"
            >
              Download 
            </a>
             <button
        onClick={handleReset}
        className=" m-5 inline-flex items-center justify-center bg-gray-500  transition-colors px-6 py-2 rounded-md font-semibold text-sm sm:text-base text-white cursor-pointer"
      >
        Reset
      </button>
          </div>
        )}
      </section>
    )}
  </div>
</main>

  );
}



