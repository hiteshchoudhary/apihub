import { LazyExoticComponent } from "react";
import { LazyCodesList, LazyFindCode, LazyHome, LazyQuiz } from "../pages";

interface AppRouteType {
    path: string;
    component: LazyExoticComponent<() => JSX.Element>;
    name: string;
}
const AppRoutes: AppRouteType[] = [
    {
        path: '/',
        component: LazyHome,
        name: 'Home',
    },
    {
        path: '/codes-list',
        component: LazyCodesList,
        name: 'Codes List',
    },
    {
        path: '/find-code',
        component: LazyFindCode,
        name: 'Find Code',
    },
    {
        path: "/quiz",
        component: LazyQuiz,
        name: "Quiz",
    }

];

export { AppRoutes };
export default AppRoutes;
