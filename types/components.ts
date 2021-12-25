export interface SimpelArticle {
  title: string;
  description: string;
  id: number;
}

export interface NavMenuItem {
  href: string;
  name: string;
  id: number;
}

export interface EventInfo {
  End_date?: string;
  description?: string;
  files?: {
    data: File[];
  };
  id: number;
  link?: string;
  start_date: string;
  title: string;
}

export interface File {
  attributes: {
    name: string;
    url: string;
  };
  id: number;
}
