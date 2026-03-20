import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

const MediaGallery = ({ messages, initialImageIndex = 0, onClose }) => {
  const images = messages
    .filter((msg) => msg.image)
    .map((msg) => ({
      _id: msg._id,
      url: msg.image,
      sender: msg.sender?.username,
      timestamp: msg.createdAt,
    }));

  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
      >
        <XIcon className="w-6 h-6" />
      </button>

      {/* Image Container */}
      <div className="relative max-w-4xl w-full">
        {/* Main Image */}
        <div className="bg-black rounded-lg overflow-hidden">
          <img
            src={currentImage.url}
            alt="Media"
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        </div>

        {/* Image Info */}
        <div className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 p-4 rounded-b-lg flex items-center justify-between">
          <div className="text-sm text-slate-300">
            <p className="font-medium">From {currentImage.sender}</p>
            <p className="text-xs text-slate-500">
              {new Date(currentImage.timestamp).toLocaleString()}
            </p>
          </div>
          <span className="text-sm text-slate-400">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-2 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-white"
              title="Previous image"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-2 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-white"
              title="Next image"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img._id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? "border-indigo-500"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
