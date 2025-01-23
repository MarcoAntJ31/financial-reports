<template>
    <v-app>
        <v-layout>
            <!-- SideMenu visible en toda la aplicación -->
            <SideMenu @select-option="optionSelected" />
            <v-main>
                <router-view />
            </v-main>
        </v-layout>
    </v-app>
</template>

<script setup>
import SideMenu from "@/components/SideMenu.vue";
import { ref } from "vue";

const optionSelectedNumber = ref(1);

function optionSelected(option) {
    optionSelectedNumber.value = option;
}
</script>
