export type Source = "desktop" | "mobile" | "app";

interface Images {
  [key: string | "default"]: string;
}

interface Category {
  id: string;
  name: string;
  parents: string[];
  used: boolean;
}

interface Tag {
  id: string;
  name: string;
  parents: string[];
}

export interface Sku {
  sku: string;
  specs: Record<string, unknown>;
  properties: Properties;
}

interface Properties {
  name: string;
  url: string;
  images: Images;
  status: string;
  price: number;
  installment: Installment;
  oldPrice: number;
  stock: number;
  eanCode: string;
  details: Record<string, unknown>;
}

interface Installment {
  count: number;
  price: number;
}

interface Spec {
  id: string;
  label: string;
  properties: unknown;
}

export interface Product {
  id: string;
  collectInfo: {
    productId: string;
    skuList: string[];
  };
  clickUrl: string;
  name: string;
  price: number;
  oldPrice: number;
  url: string;
  images: Images;
  installment: Installment;
  status: string;
  cId?: string;
  iId?: string;
  categories: Category[];
  tags: Tag[] | null;
  specs: Record<string, Spec[]>;
  created: string;
  brand: string | null;
  skus: Sku[];
  details: Record<string, string[]>;
  description: string;
}

export type ProductFormat = "onlyIds" | "complete" | "compact";