import { useEffect } from "react";


/* Execute something on refresh of page */
const useOnRefresh = (functionToExecute: () => void) => {

    useEffect(() => {
        window.addEventListener("beforeunload", functionToExecute);

        return () => {
            window.removeEventListener("beforeunload", functionToExecute);
        }
    }, [functionToExecute])

}

export default useOnRefresh;