import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ForwardedRef, useId } from "react";
import AddIcon from "../icons/AddIcon";
import Image from "./Image";
import ErrorMessage from "./ErrorMessage";
import DeleteIcon from "../icons/DeleteIcon";
import { useAppSelector } from "../../store";
import Button from "./Button";


export interface ImagePickerActions {
  forceSetSelectedImage(file: File): void;
}
interface ImagePickerProps {
  className?: string;
  altText: string;
  onChange(selectedImage?: File): void;
  errorMessage?: string;
  actionsRef?: ImagePickerActions;
}
const ImagePicker = React.forwardRef(
  (props: ImagePickerProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
      className = "",
      altText = "",
      onChange,
      errorMessage = "",
      actionsRef
    } = props;
    const id = useId();

    const isRTL = useAppSelector((state) => state.language.isRTL);

    /* Selected Image File */
    const [selectedImage, setSelectedImage] = useState<File>();

    /* Image Change Handler */
    const imageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      /* Setting state and passing data back to parent */
      if (event?.target?.files?.[0]) {
        setSelectedImage(event.target.files[0]);
        onChange(event.target.files[0]);
      }
    };

    /* Remove Image Handler setting selected image to undefined, and passing it to parent */
    const removeImageHandler = () => {
      setSelectedImage(undefined);
      onChange(undefined);
    }


    /* URL for previewing the image */
    const previewSource = useMemo(() => {
      if (selectedImage) {
        return URL.createObjectURL(selectedImage);
      }
      return null;
    }, [selectedImage]);

    useEffect(() => {
      if(actionsRef){
        actionsRef.forceSetSelectedImage = (file: File) => {
          setSelectedImage(file);
        }
      }
    }, [actionsRef])

    return (
      <>
        <label
          htmlFor={id}
          className={`relative border border-dashed border-neutral-500
          rounded flex items-center justify-center cursor-pointer transition transform hover:scale-105 ${className}`}
        >
          {previewSource && selectedImage ? (
            <Image
              src={previewSource}
              backupImageSrc=""
              alt={altText}
              className="w-full h-full"
            />
          ) 
          :
          (
            <AddIcon className="w- h-5" />
          )}

          <Button onClickHandler={removeImageHandler} className={`absolute bg-white rounded p-1 ${isRTL ? '-left-2' : '-right-2'} -top-2`}>
            <DeleteIcon className="w-3 h-3" />
          </Button>

        </label>
        {errorMessage && (
          <ErrorMessage message={errorMessage} isErrorIconShown={false} className="capitalize" />
        )}
        <input
          type="file"
          id={id}
          className="hidden"
          ref={ref}
          onChange={imageChangeHandler}
          accept="image/*"
        />
      </>
    );
  }
);

export default ImagePicker;
