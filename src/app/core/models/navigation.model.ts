export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: NavigationItem[];
}

export interface NavigationSection {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  children: NavigationItem[];
}

export interface NavigationConfig {
  mainNav: NavigationSection[];
}
