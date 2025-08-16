import { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface Meta {
  currentPage: number;
  hasNextPage: boolean;
  limit: number;
  total: number;
  totalPages: number;
}
export interface GenericResponse<T> {
  success: boolean;
  data: T;
  meta: Meta;
  message: string;
  error?: string;
  statusCode?: number;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginationOptions {
  currentPage: number;
  limit: number;
}

export enum BLOOD_COLLECTION_TUBE_COLOR {
  TAMPA_ROXA = "Tampa Roxa",
  TAMPA_VERMELHA = "Tampa Vermelha",
  TAMPA_CINZA = "Tampa Cinza",
  TAMPA_AZUL = "Tampa Azul",
}

export enum SolicitationStatus {
  CRIADO, // azul
  FILTRAGEM, // amerelo
  EM_TRANSPORTE, // amarelo
  EM_ANALISE, // amarelo
  BLOQUEADO, // laranja
  FINALIZADO, // verde
  CANCELADO, // vermelho
}

export enum ExamResultType {
  PCR_QUALITATIVO = "PCR Qualitativo",
  PCR_QUANTITATIVO = "PCR Quantitativo",
}
