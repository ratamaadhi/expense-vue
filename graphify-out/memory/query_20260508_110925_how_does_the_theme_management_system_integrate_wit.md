---
type: "query"
date: "2026-05-08T11:09:25.935033+00:00"
question: "How does the theme management system integrate with the sidebar and application components?"
contributor: "graphify"
source_nodes: ["useTheme,ThemeToggle,AppSidebar,applyTheme"]
---

# Q: How does the theme management system integrate with the sidebar and application components?

## Answer

ThemeToggle.vue uses useTheme() composable which applies 'dark' class to document.documentElement. AppSidebar and other components use CSS variables that automatically respond to .dark class. Integration is indirect through DOM/CSS layer, not direct component relationships.

## Source Nodes

- useTheme,ThemeToggle,AppSidebar,applyTheme