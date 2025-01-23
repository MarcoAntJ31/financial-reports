<template>
    <v-navigation-drawer permanent :width="240">
      <v-list-item title="Reportes financieros" subtitle="Forte Innovation Consulting"></v-list-item>
      <v-divider></v-divider>
      <v-list nav>
        <v-list-item 
          prepend-icon="mdi-table" 
          title="Información de reportes" 
          @click="emitSelection(1)"
        ></v-list-item>
        <v-list-item 
          prepend-icon="mdi-account-supervisor-circle" 
          title="Supervisores" 
          @click="emitSelection(2)"
        ></v-list-item>
        <v-list-item 
          prepend-icon="mdi-clock-start" 
          title="Clock-in" 
          @click="emitSelection(3)"
        ></v-list-item>
        
        <v-list-group value="config">
          <template v-slot:activator="{ props }">
            <v-list-item 
              v-bind="props" 
              prepend-icon="mdi-theme-light-dark" 
              title="Dark mode"
            ></v-list-item>
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
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['selectOption']);
  
  function emitSelection(optionNumber: number) {
    emit('selectOption', optionNumber);
    console.log(optionNumber)
  };
  </script>
  