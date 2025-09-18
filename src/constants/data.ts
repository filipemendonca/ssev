import { NavItem } from "@/types";

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: "Painel",
    url: "/dashboard",
    icon: "dashboard",
    isActive: true,
    shortcut: ["d", "d"],
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: "Administrativo",
    url: "#",
    icon: "lock",
    isActive: false,
    items: [
      {
        title: "Amostras",
        url: "/dashboard/sample",
      },
      {
        title: "Agentes Infecciosos",
        url: "/dashboard/infectious-agents",
      },
      {
        title: "Exames",
        url: "/dashboard/exams",
      },
      {
        title: "Template de Exames",
        url: "/dashboard/examsResultTemplate",
      },
      {
        title: "Usuários",
        url: "/dashboard/users",
      },
    ],
  },
  {
    title: "Solicitações",
    url: "/dashboard/solicitations",
    icon: "pin",
    shortcut: ["k", "k"],
    isActive: false,
    items: [], // No child items
  },
];
