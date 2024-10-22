export const sidebarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/explore.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/icons/people.svg",
    route: "/all-users",
    label: "People",
  },
  {
    imgURL: "/assets/icons/bookmark.svg",
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/create-post",
    label: "Create Post",
  },
];
interface User {
  id: string;
}

export const getBookmarksLinks = (user: User) => [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/explore.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/icons/people.svg",
    route: "/all-users",
    label: "People",
  },
  {
    imgURL: "/assets/icons/account.svg",
    route: `/profile/${user?.id}`,
    label: "Account",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/create-post",
    label: "Create",
  },
  {
    imgURL: "/assets/icons/bookmark.svg",
    route: "/saved",
    label: "Saved",
  },
];


export const socialLinks = [
  {
    title: "Follow me on GitHub !",
    href: "#",
    imageSrc: "/assets/images/github-mark-white.png",
    alt: "GitHub",
  },
  {
    title: "Connect on LinkedIn !",
    href: "#",
    imageSrc: "/assets/images/linkedin-mark.png",
    alt: "LinkedIn",
  },
  {
    title: "Catch me on X !",
    href: "#",
    imageSrc: "/assets/images/x-mark.svg",
    alt: "X",
  },
];
