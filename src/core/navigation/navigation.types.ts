import type { Component } from 'vue';
import type { Permission, Role } from '@core/permissions';

export interface NavBadge {
  text: string | number;
  variant?: 'default' | 'primary' | 'destructive' | 'secondary' | 'outline';
}

export interface NavItemConfig {
  /** Unique identifier for the nav item */
  id: string;
  /** Vue router target path or route location */
  to: string;
  /** Translation key for i18n label */
  labelKey?: string;
  /** Default fallback display label */
  label: string;
  /** SVG Vue icon component */
  icon: Component;
  /** Optional badge */
  badge?: string | number | (() => string | number | undefined);
  badgeVariant?: NavBadge['variant'];
  /** Required roles to view this item (user must have at least one of these roles) */
  roles?: Role[];
  /** Required permissions (evaluated according to permissionOp) */
  permissions?: Permission[];
  /** Permission check operator (default: 'OR') */
  permissionOp?: 'AND' | 'OR';
  /** Custom dynamic predicate to show/hide item */
  predicate?: () => boolean;
  /** Sub-items if hierarchical */
  children?: NavItemConfig[];
}

export interface NavSectionConfig {
  /** Unique section identifier */
  id: string;
  /** Section heading label */
  title?: string;
  /** Translation key for section title */
  titleKey?: string;
  /** Roles allowed to view entire section */
  roles?: Role[];
  /** Permissions allowed to view section */
  permissions?: Permission[];
  /** List of nav items in this section */
  items: NavItemConfig[];
}
