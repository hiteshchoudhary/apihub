import { SyntheticEvent } from "react";

interface ImageProps {
    src: string,
    alt: string,
    backupImageSrc: string,
    className?: string
}
const Image = (props: ImageProps) => {

    const {src, alt, backupImageSrc, className = ''} = props

    const imgLoadErrorHandler = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        const target = event.currentTarget;
        target.onerror = null;
        target.src = backupImageSrc;
    }   
    return (
        <img src={src} alt={alt} className={className} onError={imgLoadErrorHandler}  />
    )
}

export default Image;