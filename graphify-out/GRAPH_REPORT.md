# Graph Report - .  (2026-05-08)

## Corpus Check
- Corpus is ~19,517 words - fits in a single context window. You may not need a graph.

## Summary
- 281 nodes · 168 edges · 19 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 22,288 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Deployment Documentation|Deployment Documentation]]
- [[_COMMUNITY_shadcn Dialog Components|shadcn Dialog Components]]
- [[_COMMUNITY_Main Application Components|Main Application Components]]
- [[_COMMUNITY_App Initialization & State|App Initialization & State]]
- [[_COMMUNITY_Navigation Components|Navigation Components]]
- [[_COMMUNITY_Utility Functions & Exports|Utility Functions & Exports]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Data Visualization|Data Visualization]]
- [[_COMMUNITY_Docker Configuration|Docker Configuration]]
- [[_COMMUNITY_API Client|API Client]]
- [[_COMMUNITY_Theme Management|Theme Management]]
- [[_COMMUNITY_Brand Assets & Icons|Brand Assets & Icons]]
- [[_COMMUNITY_Sidebar State Management|Sidebar State Management]]
- [[_COMMUNITY_Build Configuration|Build Configuration]]
- [[_COMMUNITY_Component 16|Component 16]]
- [[_COMMUNITY_Component 18|Component 18]]
- [[_COMMUNITY_Component 164|Component 164]]
- [[_COMMUNITY_Component 165|Component 165]]
- [[_COMMUNITY_Component 166|Component 166]]

## God Nodes (most connected - your core abstractions)
1. `Expense Tracker Application` - 21 edges
2. `Vue 3 Expense Tracker UI` - 7 edges
3. `useTheme()` - 3 edges
4. `Docker Compose Service Configuration` - 3 edges
5. `updateResolvedTheme()` - 2 edges
6. `applyTheme()` - 2 edges
7. `setOpenMobile()` - 2 edges
8. `toggleSidebar()` - 2 edges
9. `Dokploy Deployment Method` - 2 edges
10. `Docker Deployment Method` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Layered UI Component Design` --visually_represents--> `Expense Tracker Application`  [INFERRED]
  src/assets/hero.png → README.md
- `Deployment Troubleshooting Guide` --troubleshoots--> `Expense Tracker Application`  [EXTRACTED]
  DEPLOYMENT.md → README.md
- `Netlify Platform Configuration` --deploys--> `Expense Tracker Application`  [EXTRACTED]
  DEPLOYMENT.md → README.md
- `Vercel Platform Configuration` --deploys--> `Expense Tracker Application`  [EXTRACTED]
  DEPLOYMENT.md → README.md
- `AWS S3 CloudFront Configuration` --deploys--> `Expense Tracker Application`  [EXTRACTED]
  DEPLOYMENT.md → README.md

## Hyperedges (group relationships)
- **Vue 3 Expense Tracker Tech Stack** — readme_vue_framework, readme_typescript_language, readme_vite_build_tool, readme_tailwind_styling, readme_shadcn_components, readme_pinia_state, readme_vue_router, readme_axios_api, readme_lucide_icons [EXTRACTED 1.00]
- **Deployment Methods** — readme_dokploy_deployment, readme_docker_deployment, deployment_netlify_config, deployment_vercel_config, deployment_aws_s3_config [EXTRACTED 1.00]
- **Application Architecture Configuration** — claude_composition_api, claude_path_aliases, claude_shadcn_config, claude_build_process, claude_cn_utility [EXTRACTED 1.00]
- **Vue.js + Vite Framework Branding** —  [INFERRED]
- **Social Platform Icons** —  [INFERRED]
- **app-initialization-flow** —  [INFERRED]
- **build-configuration** —  [INFERRED]
- **api-proxy-setup** —  [INFERRED]
- **standard CRUD operations (list, get, create, update, delete)** —  [INFERRED 1.00]
- **response interceptor attaches ApiError to rejection** —  [INFERRED 1.00]
- **crud_views_pattern** —  [INFERRED 0.90]
- **store_centric_data_flow** —  [INFERRED 1.00]
- **loading_state_pattern** —  [INFERRED 0.95]
- **currency_formatting_reuse** —  [INFERRED 1.00]
- **modal_dialog_pattern** —  [INFERRED 0.95]
- **category_budget_relationship** —  [INFERRED 0.95]
- **layout:app-shell** —  [INFERRED]
- **theme:implementation** —  [INFERRED]
- **state:app-store-consumers** —  [INFERRED]
- **navigation:routing-integration** —  [INFERRED]
- **ui:shadcn-components** —  [INFERRED]
- **form:transaction-workflow** —  [INFERRED]
- **navigation_components** —  [INFERRED]
- **data_visualization_components** —  [INFERRED]
- **shadcn_ui_integration** —  [INFERRED]
- **icon_system** —  [INFERRED]
- **pattern:tabs-composition** — vue-component:Tabs, vue-component:TabsList, vue-component:TabsTrigger, vue-component:TabsContent [INFERRED]
- **pattern:props-delegation** — vue-component:Tabs, vue-component:TabsList, vue-component:TabsTrigger, vue-component:TabsContent, utility:reactiveOmit [INFERRED]
- **pattern:styling-architecture** — vue-component:Tabs, vue-component:TabsList, vue-component:TabsTrigger, vue-component:TabsContent, utility:cn [INFERRED]
- **dialog:full_dialog_composition** — dialog:DialogRoot, dialog:DialogTrigger, dialog:DialogContent, dialog:DialogHeader, dialog:DialogTitle, dialog:DialogDescription, dialog:DialogFooter, dialog:DialogClose [INFERRED]
- **dialog:styling_pattern_consistency** — dialog:DialogContent, dialog:DialogScrollContent, dialog:DialogTitle, dialog:DialogDescription, dialog:DialogOverlay [INFERRED]
- **dialog:portal_pattern** — dialog:DialogContent, dialog:DialogScrollContent, dialog:DialogOverlay [INFERRED]
- **dialog:data_slot_attributes** — dialog:DialogRoot, dialog:DialogTrigger, dialog:DialogContent, dialog:DialogHeader, dialog:DialogFooter, dialog:DialogTitle, dialog:DialogDescription, dialog:DialogClose, dialog:DialogOverlay [INFERRED]
- **dialog:reka_ui_abstraction** — dialog:DialogRoot, dialog:DialogTrigger, dialog:DialogContent, dialog:DialogTitle, dialog:DialogDescription, dialog:DialogClose, dialog:DialogOverlay [INFERRED]

## Communities (167 total, 6 thin omitted)

### Community 0 - "Deployment Documentation"
Cohesion: 0.09
Nodes (23): AWS S3 CloudFront Configuration, Docker Deployment Guide, Dokploy Deployment Guide, Netlify Platform Configuration, Deployment Security Considerations, Deployment Troubleshooting Guide, Vercel Platform Configuration, Layered UI Component Design (+15 more)

### Community 1 - "shadcn Dialog Components"
Cohesion: 0.31
Nodes (18): dialog:DialogClose, dialog:DialogContent, dialog:DialogDescription, dialog:DialogFooter, dialog:DialogHeader, dialog:DialogOverlay, dialog:DialogRoot, dialog:DialogScrollContent (+10 more)

### Community 2 - "Main Application Components"
Cohesion: 0.24
Nodes (14): component:AddTransactionDialog.vue, component:AppSidebar.vue, component:DataTable.vue, component:SiteHeader.vue, component:ThemeToggle.vue, composable:useTheme, form:transaction-schema, integration:lucide-vue-next (+6 more)

### Community 3 - "App Initialization & State"
Cohesion: 0.2
Nodes (6): app-store, pinia, sidebar-layout, src/App.vue, src/main.ts, vue-router

### Community 4 - "Navigation Components"
Cohesion: 0.28
Nodes (9): Document, NavDocuments, NavItem, NavSecondary, NavUser, User, shadcn_dropdown, shadcn_sidebar (+1 more)

### Community 5 - "Utility Functions & Exports"
Cohesion: 0.47
Nodes (9): export:tabs-index, utility:cn, utility:reactiveOmit, utility:useForwardProps, utility:useForwardPropsEmits, vue-component:Tabs, vue-component:TabsContent, vue-component:TabsList (+1 more)

### Community 6 - "Project Documentation"
Cohesion: 0.29
Nodes (7): TypeScript Build Process with vue-tsc, cn() className merging utility, Vue 3 Composition API with script setup, Expsense API OpenAPI Specification, Path Alias Configuration @/*, Vue 3 Expense Tracker UI, shadcn-vue Component Configuration

### Community 7 - "Data Visualization"
Cohesion: 0.29
Nodes (7): ChartAreaInteractive, SectionCards, appStore, lucide_icons, shadcn_card, shadcn_chart, unovis

### Community 8 - "Docker Configuration"
Cohesion: 0.4
Nodes (5): Docker Health Check Configuration, Docker Build Configuration, Docker Health Check, Port Mapping 3002:80, Docker Compose Service Configuration

### Community 9 - "API Client"
Cohesion: 0.4
Nodes (5): api_analytics, api_apiClient, api_budgets, api_categories, api_transactions

### Community 10 - "Theme Management"
Cohesion: 0.83
Nodes (3): applyTheme(), updateResolvedTheme(), useTheme()

### Community 11 - "Brand Assets & Icons"
Cohesion: 0.5
Nodes (4): Vue.js Favicon, Social Media Icons Sprite Sheet, Vite Logo Asset, Vue.js Logo Asset

### Community 14 - "Build Configuration"
Cohesion: 0.67
Nodes (3): vite-plugin-tailwindcss, vite-plugin-vue, vite.config.ts

## Knowledge Gaps
- **33 isolated node(s):** `Application Mount Point`, `Main Entry Point Script`, `Vue 3 Framework`, `TypeScript Language`, `Vite Build Tool` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Expense Tracker Application` connect `Deployment Documentation` to `Project Documentation`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `Vue 3 Expense Tracker UI` connect `Project Documentation` to `Deployment Documentation`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `Application Mount Point`, `Main Entry Point Script`, `Vue 3 Framework` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Deployment Documentation` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._