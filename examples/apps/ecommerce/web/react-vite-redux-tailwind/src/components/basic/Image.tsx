import { SyntheticEvent, useState } from "react";
import LoadingSpinner from "../icons/LoadingSpinner";

interface ImageProps {
  src: string;
  alt: string;
  backupImageSrc: string;
  className?: string;
}
const Image = (props: ImageProps) => {
  const { src, alt, backupImageSrc, className = "" } = props;

  const [isLoading, setIsLoading] = useState(true);

  /* On error loading the image, show the backupImage */
  const imgLoadErrorHandler = (
    event: SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.currentTarget;
    /* On error of backupImageSrc, set loading to false */
    target.onerror = () => {setIsLoading(false)};
    target.src = backupImageSrc;
  };

  /* Once the image is loaded hide the loading spinner */
  const onImageLoaded = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className={className}>
          <div className="flex items-center justify-center w-full h-full">
            <LoadingSpinner className="fill-black text-gray-200 w-1/2 h-1/2" />
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? "hidden" : "block"}`}
        onError={imgLoadErrorHandler}
        onLoad={onImageLoaded}
      />
    </>
  );
};

export default Image;
