<template>
    <v-card>
        <div class="d-flex align-center justify-center ga-5 pa-4">
            <v-text-field 
                v-model="clientId" 
                variant="outlined"
                color="primary"
                prepend-icon="mdi-account"
                label="ID del Cliente" 
            />
            <v-text-field 
                v-model="categoria" 
                variant="outlined"
                color="primary"
                prepend-icon="mdi-train-car"
                label="Categoría" 
            />
            <v-select 
                v-model="tipo" 
                color="primary"
                :items="transactionTypes" 
                prepend-icon="mdi-cash"
                variant="outlined"
                label="Tipo" 
            />
            <v-select 
                v-model="estado" 
                variant="outlined"
                color="primary"
                prepend-icon="mdi-state-machine"
                :items="transactionStates" 
                label="Estado" 
            />
            <v-btn 
                color="primary"
                variant="tonal" 
                size="large"
                class="mb-5"
                @click="clearFilters"
            >
                Limpiar
            </v-btn>
            <v-btn 
                color="primary"
                variant="elevated" 
                size="large"
                class="mb-5"
                @click="applyFilters"
            >
                Buscar
            </v-btn>
        </div>
    </v-card>
</template>

<script setup lang="ts">

import { ref, defineEmits } from 'vue';
import type { TransactionType, TransactionState } from '@/services/reports/types';

const clientId = ref<string | null>(null);
const tipo = ref<TransactionType | null>(null);
const categoria = ref<string | null>(null);
const estado = ref<TransactionState | null>(null);
const transactionTypes: TransactionType[] = ['income', 'expense'];
const transactionStates: TransactionState[] = ['activada', 'desactivada'];

const emit = defineEmits(['apply-filters', 'clear-filters']);

function applyFilters() {
    emit('apply-filters', {
        cliente_id: clientId.value,
        categoría: categoria.value,
        tipo: tipo.value,
        estado: estado.value,
    });
}

function clearFilters() {
    clientId.value = null;
    tipo.value = null;
    categoria.value = null;
    estado.value = null;

    emit('clear-filters');
}
</script>