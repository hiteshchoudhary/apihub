import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Leftsidebar from "@/components/shared/Leftsidebar";
import Topbar from "@/components/shared/Topbar";
import { Outlet } from "react-router-dom";
import BigLoader from "@/components/shared/BigLoader";

gsap.registerPlugin(ScrollTrigger);

const RootLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Check initial network statez

  useEffect(() => {
    // Check the initial document.readyState
    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      // Listen for changes in the readyState
      const handleLoad = () => setIsLoading(false);

      // Event listeners to detect when the browser finishes loading
      window.addEventListener("load", handleLoad);

      // Cleanup the event listener on unmount
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  useEffect(() => {
    // Update the online status when the user goes offline or online
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners for online and offline detection
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup the event listeners on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* Show the loader while the page is loading */}
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <BigLoader />
        </div>
      ) : (
        <div className="w-full max-h-fit md:flex relative">
          {!isOnline && (
            <div className="fixed bg-rose-600 bottom-0 left-0 w-full text-white text-center  flex justify-center items-center z-50">
              You are offline.
            </div>
          )}
          <Topbar />
          <Leftsidebar />
          <section className="root-layout">
            <Outlet />
          </section>
        </div>
      )}
    </>
  );
}

export default RootLayout;
