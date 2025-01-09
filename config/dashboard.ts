// config/dashboard.ts
import { UserRole } from "@prisma/client";
import { SidebarNavItem } from "@/types";

export async function getDashboardLinks(unreadDonations: number = 0, unreadMessages: number = 0) {
  return [
    {
      titleKey: "dashboard.sections.main",
      items: [
        {
          href: "/admin",
          icon: "dashboard",
          titleKey: "dashboard.sections.dashboard",
          authorizeOnly: UserRole.ADMIN,
        },
      ],
    },
    {
      titleKey: "dashboard.sections.sections",
      items: [
        {
          href: "/admin/sections",
          icon: "Layers",
          titleKey: "dashboard.sections.sections",
          authorizeOnly: UserRole.ADMIN,
        },
        {
          href: "/admin/services",
          icon: "Wrench",
          titleKey: "dashboard.sections.services",
          authorizeOnly: UserRole.ADMIN,
        },
        {
          href: "/admin/features",
          icon: "Stars",
          titleKey: "dashboard.sections.features",
          authorizeOnly: UserRole.ADMIN,
        },
        {
          href: "/admin/clients",
          icon: "Users",
          titleKey: "dashboard.sections.clients",
          authorizeOnly: UserRole.ADMIN,
        },
      ],
    },
    {
      titleKey: "dashboard.sections.contacts",
      items: [
        {
          href: "/admin/contacts",
          icon: "MessagesSquare",
          titleKey: "dashboard.sections.messages",
          badge: unreadMessages,
          authorizeOnly: UserRole.ADMIN,
        },
      ],
    },
    {
      titleKey: "dashboard.sections.options",
      items: [
        { 
          href: "/admin/settings", 
          icon: "Settings", 
          titleKey: "dashboard.sections.settings" 
        },
        { 
          href: "/", 
          icon: "Home", 
          titleKey: "dashboard.sections.website" 
        },
      ],
    },
  ] as SidebarNavItem[];
}
