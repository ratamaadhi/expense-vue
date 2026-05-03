<script setup lang="ts">
import { markRaw, computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAppStore } from "@/stores/app";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Loader2, LayoutDashboard, ListPlus, Tag, Wallet } from "lucide-vue-next";

const appStore = useAppStore();
const route = useRoute();
const { state } = useSidebar();

const isCollapsed = computed(() => state.value === 'collapsed');

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: markRaw(LayoutDashboard),
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: markRaw(ListPlus),
  },
  {
    title: "Categories",
    href: "/categories",
    icon: markRaw(Tag),
  },
  {
    title: "Budgets",
    href: "/budgets",
    icon: markRaw(Wallet),
  },
];

function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
  return formatted.replace("Rp", "Rp ");
}
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary"
              >
                <Wallet class="size-4 text-primary-foreground" />
              </div>
              <span class="text-lg font-semibold">Expense Tracker</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarMenu class="px-2 py-4">
        <SidebarMenuItem v-for="item in navItems" :key="item.href">
          <SidebarMenuButton
            :is-active="route.path === item.href"
            :as="markRaw(RouterLink)"
            :to="item.href"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.title }}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>

    <SidebarFooter v-if="!isCollapsed" class="border-t p-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <div v-if="appStore.summary" class="rounded-lg border bg-card p-3 space-y-1.5">
            <div class="flex justify-between text-xs">
              <span class="text-muted-foreground">Balance</span>
              <span
                :class="
                  appStore.netBalance >= 0
                    ? 'font-medium text-[color:var(--chart-3)]'
                    : 'font-medium text-destructive'
                "
              >
                {{ formatCurrency(appStore.netBalance) }}
              </span>
            </div>
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>Income</span>
              <span class="text-[color:var(--chart-3)]">{{
                formatCurrency(appStore.totalIncome)
              }}</span>
            </div>
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>Expenses</span>
              <span class="text-destructive">{{ formatCurrency(appStore.totalExpense) }}</span>
            </div>
          </div>
          <div v-else class="flex items-center justify-center">
            <Loader2 class="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
