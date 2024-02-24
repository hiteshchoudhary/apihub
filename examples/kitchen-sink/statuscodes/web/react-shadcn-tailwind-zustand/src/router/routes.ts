import { Home } from "@/pages";

interface AppRouteType {
    path: string;
    component: () => React.ReactNode;
    name: string;
}
const AppRoutes: AppRouteType[] = [
    {
        path: '/',
        component: Home,
        name: 'Home',
    },

];

export { AppRoutes };
export default AppRoutes;
