import React from "react";
import CodesList from "./codesList";
import FindCode from "./findCode";
import Home from "./home";
import Quiz from "./quiz";

const LazyCodesList = React.lazy(() => import("./codesList"));
const LazyFindCode = React.lazy(() => import("./findCode"));
const LazyHome = React.lazy(() => import("./home"));
const LazyQuiz = React.lazy(() => import("./quiz"));

export { CodesList, FindCode, Home, Quiz, LazyCodesList, LazyFindCode, LazyHome, LazyQuiz };