import { NavMenuItem } from './components';

export interface NavigationMenu {
  attributes: {
    id: number;
    logo: string;
    Menu_item: NavMenuItem[];
  };
}
