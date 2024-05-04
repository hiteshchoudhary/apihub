import { useEffect, useState } from "react";
import { ImageClass } from "../../services/product/ProductTypes";
import Image from "../basic/Image";
import { useAppSelector } from "../../store";

interface ProductImagesViewProps {
  mainImage: ImageClass;
  subImages: Array<ImageClass>;
  productName: string;
  className?: string;
}
const ProductImagesView = (props: ProductImagesViewProps) => {
  const { mainImage, subImages, productName, className } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* Top Image is the largest image shown */
  const [topImage, setTopImage] = useState(mainImage);

  /* Other images */
  const [otherImages, setOtherImages] = useState(subImages);

  /* To Change the main top image shown */
  const changeTopImage = (newTopImage: ImageClass): void => {
    /* 
    Replace the image clicked (newTopImage) with the top image, 
    and set the top image to the image clicked (newTopImage) 
    */
    setOtherImages((prev) => {
      const imageIndex = prev.findIndex(
        (image) => image.url === newTopImage.url
      );
      if (imageIndex !== -1) {
        prev[imageIndex] = topImage;
        setTopImage(newTopImage);
      }
      return prev;
    });
  };

  useEffect(() => {
    setTopImage(mainImage);
  }, [mainImage]);

  useEffect(() => {
    setOtherImages(subImages);
  }, [subImages]);
  return (
    <div
      className={`flex flex-col ${
        isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
      } ${className}`}
    >
      <div className="bg-neutral-100 rounded --add-later-p-4 flex justify-center items-center lg:order-1 lg:flex-1">
        <Image
          src={topImage.url}
          alt={productName}
          backupImageSrc=""
          className="rounded h-full"
        />
      </div>
      <div className="flex gap-x-1 lg:gap-x-0 lg:flex-col lg:h-full lg:gap-y-4 lg:justify-center">
        {otherImages.map((otherImage) => (
          <button
            key={otherImage._id}
            className="bg-neutral-100 rounded --add-later-p-2 lg:h-[22.8%]"
            onClick={() => {
              changeTopImage(otherImage);
            }}
          >
            <Image
              src={otherImage.url}
              alt={productName}
              backupImageSrc=""
              className="rounded h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImagesView;
