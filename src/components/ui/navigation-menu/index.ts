import { cva } from "class-variance-authority";

export { default as NavigationMenu } from "./NavigationMenu.vue";
export { default as NavigationMenuContent } from "./NavigationMenuContent.vue";
export { default as NavigationMenuIndicator } from "./NavigationMenuIndicator.vue";
export { default as NavigationMenuItem } from "./NavigationMenuItem.vue";
export { default as NavigationMenuLink } from "./NavigationMenuLink.vue";
export { default as NavigationMenuList } from "./NavigationMenuList.vue";
export { default as NavigationMenuTrigger } from "./NavigationMenuTrigger.vue";
export { default as NavigationMenuViewport } from "./NavigationMenuViewport.vue";

// Simplified: remove automatic background color changes so consumer can fully control (we want underline only in Navbar)
export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50"
);
