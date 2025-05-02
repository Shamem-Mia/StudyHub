import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../context/axiosInstance";

const Advertisements = () => {
  const containerRef = useRef(null);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ads once on mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axiosInstance.get("/ads");
        const activeAds = data.ads.filter(
          (ad) => ad.isActive && ad.scriptContent
        );
        setAds(activeAds);
      } catch (error) {
        console.error("Failed to load ads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Slide to next ad every 8 seconds
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [ads]);

  // Load current ad script into container with cleanup
  useEffect(() => {
    const container = containerRef.current;
    if (!container || ads.length === 0) return;

    // Clear previous ad immediately
    container.innerHTML = "";

    // Create a wrapper div for better control
    const adWrapper = document.createElement("div");
    adWrapper.className = "w-full h-full";
    container.appendChild(adWrapper);

    const currentAd = ads[currentAdIndex];
    if (!currentAd?.scriptContent) return;

    try {
      // Create and append the new ad script
      const range = document.createRange();
      range.selectNode(adWrapper);
      const fragment = range.createContextualFragment(currentAd.scriptContent);
      adWrapper.appendChild(fragment);

      // Force resize to ensure proper ad fitting
      const checkSize = () => {
        if (adWrapper.firstChild) {
          const child = adWrapper.firstChild;
          if (child.style) {
            child.style.width = "160px";
            child.style.height = "300px";
          }
        }
      };

      // Check size immediately and after a short delay
      checkSize();
      const resizeTimeout = setTimeout(checkSize, 100);

      return () => clearTimeout(resizeTimeout);
    } catch (error) {
      console.error("Error loading ad:", error);
    }
  }, [currentAdIndex, ads]);

  if (isLoading) {
    return (
      <div className="w-[160px] h-[300px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading ads...</p>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="w-[160px] h-[300px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No active ads</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-[200px] h-[300px] bg-white border border-gray-200 overflow-hidden relative"
    />
  );
};

export default Advertisements;
