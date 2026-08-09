import { computed } from 'vue';
import { usePermissions } from '@core/permissions';
import { navigationConfig } from './navigation.config';
import type { NavItemConfig, NavSectionConfig } from './navigation.types';

export function useNavigation() {
  const { userRole, hasPermission, hasRole } = usePermissions();

  /**
   * Checks whether the current user has permission / role to access a given nav item
   */
  function canAccessItem(item: NavItemConfig): boolean {
    // 1. Dynamic custom predicate
    if (typeof item.predicate === 'function') {
      if (!item.predicate()) return false;
    }

    // 2. Role-based check
    if (item.roles && item.roles.length > 0) {
      if (!hasRole(item.roles)) {
        return false;
      }
    }

    // 3. Permission-based check
    if (item.permissions && item.permissions.length > 0) {
      if (item.permissionOp === 'AND') {
        const hasAll = item.permissions.every((p) => hasPermission(p));
        if (!hasAll) return false;
      } else {
        const hasAny = item.permissions.some((p) => hasPermission(p));
        if (!hasAny) return false;
      }
    }

    return true;
  }

  /**
   * Checks whether a section is accessible to current user
   */
  function canAccessSection(section: NavSectionConfig): boolean {
    if (section.roles && section.roles.length > 0) {
      if (!hasRole(section.roles)) return false;
    }
    if (section.permissions && section.permissions.length > 0) {
      const hasAny = section.permissions.some((p) => hasPermission(p));
      if (!hasAny) return false;
    }
    return true;
  }

  /**
   * Filtered sections containing only the items the current user is authorized to see
   */
  const visibleSections = computed<NavSectionConfig[]>(() => {
    return navigationConfig
      .filter((section) => canAccessSection(section))
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => canAccessItem(item)),
      }))
      .filter((section) => section.items.length > 0);
  });

  /**
   * Flat array of all visible navigation items
   */
  const visibleItems = computed<NavItemConfig[]>(() => {
    return visibleSections.value.flatMap((section) => section.items);
  });

  /**
   * Helper to check if a specific path or route is authorized
   */
  function isPathAuthorized(path: string): boolean {
    const allItems = navigationConfig.flatMap((s) => s.items);
    const matchedItem = allItems.find(
      (item) => item.to === path || (item.to !== '/' && path.startsWith(item.to + '/'))
    );
    if (!matchedItem) return true; // Unregistered route handled by router guard
    return canAccessItem(matchedItem);
  }

  return {
    userRole,
    visibleSections,
    visibleItems,
    canAccessItem,
    isPathAuthorized,
  };
}
