import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Route, Routes } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useStatusCodeStore } from "@/store/statusCodes.store";
import { processCodes } from "@/services/codesList";

const Router = () => {
  const { setHTTPStatusCodesList } = useStatusCodeStore((state) => state);
  useEffect(() => {
    processCodes().then((HTTPStatusCodesList) => {
      setHTTPStatusCodesList(HTTPStatusCodesList);
    });
  }, []);
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
