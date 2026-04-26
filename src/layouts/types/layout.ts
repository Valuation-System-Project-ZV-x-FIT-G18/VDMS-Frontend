/* Represents a single sidebar menu item */
export interface MenuItem {
  label: string;                   // displayed text in the sidebar
  path: string;                    // route path to navigate to
  icon: string;                    // emoji icon shown before label
  position?: 'bottom';             // if 'bottom', rendered near logout at sidebar bottom
}

/* Map of role names to their sidebar menu items */
export interface MenuConfig {
  [role: string]: MenuItem[];      // key = role ID, value = list of menu items
}
