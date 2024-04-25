import { useAppSelector } from "../../store";
import ErrorIcon from "../icons/ErrorIcon";


interface ErrorMessageProps {
    message: string;
    className?: string;
    errorIconClassName?: string;
    isErrorIconShown?: boolean
}
const ErrorMessage = (props: ErrorMessageProps) => {
    const {message, className, errorIconClassName = 'w-8 h-8', isErrorIconShown = true} = props;

    const isRTL = useAppSelector((state) => state.language.isRTL);
    return (
        <div className={`flex items-center text-darkRed ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {
                isErrorIconShown &&
                <ErrorIcon className={errorIconClassName} />
            }
            <span className={`capitalize ${isErrorIconShown ? isRTL ? 'mr-4': 'ml-4' : ''}`}>{message}</span>
        </div>
    )
}

export default ErrorMessage;