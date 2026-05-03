<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.initialize()
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="bg-background">
      <SiteHeader />
      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
