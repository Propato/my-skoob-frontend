<template>
    <NavHeaderComponent />
    <main class="container">
        <RouterView />
    </main>
    <FooterComponent />
</template>

<script setup lang="ts">
    import { RouterView } from "vue-router";
    import { NavHeaderComponent, FooterComponent } from "@/components";
</script>
