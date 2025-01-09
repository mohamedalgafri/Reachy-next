import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";


const site_url = env.NEXT_PUBLIC_APP_URL;


export const siteConfig: SiteConfig = {
  name: "REACHY",
  description:
    "REACHY",
  url: site_url,
  ogImage: ``,
  links: {
    twitter: "",
    github: "",
  },
  mailSupport: "",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Security", href: "#" },
      { title: "Customization", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Changelog", href: "#" },
    ],
  }
];
