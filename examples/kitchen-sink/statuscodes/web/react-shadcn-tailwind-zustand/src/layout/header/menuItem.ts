interface MenuItem {
  title: string;
  path: string;
  isDisabled: boolean;
}

const navigationMenuItems: MenuItem[] = [
  {
    title: "Codes List",
    path: "/codes-list",
    isDisabled: false,
  },
  {
    title: "Find Code",
    path: "/find-code",
    isDisabled: false,
  },
  {
    title: "Quiz",
    path: "/quiz",
    isDisabled: false,
  },
];

export default navigationMenuItems;
