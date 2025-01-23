<template>
    <v-navigation-drawer permanent :width="240">
        <v-list-item title="Reportes financieros" subtitle="Forte Innovation Consulting"></v-list-item>
        <v-divider></v-divider>
        <v-list nav>
            <v-list-item prepend-icon="mdi-table" title="Información de reportes"
                @click="navigateTo('/')"></v-list-item>
            <v-list-item prepend-icon="mdi-chart-multiple" title="Métricas"
                @click="navigateTo('/metrics')"></v-list-item>

            <v-list-group value="config">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-theme-light-dark" title="Dark mode"></v-list-item>
                </template>
                <v-list-item>
                    <ThemeToggle />
                </v-list-item>
            </v-list-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import ThemeToggle from './toggle/ThemeToggle.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Función para redirigir al usuario a la ruta seleccionada
function navigateTo(route: string) {
    router.push(route);
}
</script>