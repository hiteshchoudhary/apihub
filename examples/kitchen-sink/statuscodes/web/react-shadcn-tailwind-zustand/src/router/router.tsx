import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Route, Routes } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useAppStore } from "@/store/store";
import { processCodes } from "@/services/codesList";

const Router = () => {
  const { setHTTPStatusCodesList, setLoading, HTTPStatusCodesList } =
    useAppStore((state) => state);

  useEffect(() => {
    if (!HTTPStatusCodesList) {
      return;
    } else if (Object.keys(HTTPStatusCodesList).length > 0) {
      return;
    } else {
      setLoading(true);
      processCodes()
        .then((HTTPStatusCodesList) => {
          setHTTPStatusCodesList(HTTPStatusCodesList);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [HTTPStatusCodesList, setHTTPStatusCodesList, setLoading]);
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {AppRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export { Router };
export default Router;
