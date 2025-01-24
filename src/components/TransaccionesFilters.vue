<template>
    <v-card class="min-h">
        <div class="d-flex align-center justify-center ga-3 pa-4">
            <v-text-field 
                v-model="clientId" 
                :loading="loading"
                variant="outlined"
                color="primary"
                prepend-icon="mdi-account"
                label="ID del Cliente" 
            />
            <v-text-field 
                v-model="categoria" 
                variant="outlined"
                :loading="loading"
                color="primary"
                prepend-icon="mdi-train-car"
                label="Categoría" 
            />
            <v-select 
                v-model="tipo" 
                color="primary"
                :loading="loading"
                :items="transactionTypes" 
                prepend-icon="mdi-cash"
                variant="outlined"
                label="Tipo" 
            />
            <v-select 
                v-model="estado" 
                variant="outlined"
                color="primary"
                :loading="loading"
                prepend-icon="mdi-state-machine"
                :items="transactionStates" 
                label="Estado" 
            />
            <v-btn 
                color="primary"
                variant="tonal" 
                size="large"
                class="mb-5"
                :loading="loading"
                prepend-icon="mdi-nuke"
                @click="clearFilters"
            >
                Limpiar
            </v-btn>
            <v-btn 
                color="primary"
                variant="elevated" 
                size="large"
                class="mb-5"
                :loading="loading"
                prepend-icon="mdi-magnify"
                @click="applyFilters"
            >
                Buscar
            </v-btn>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue';
import type { TransactionType, TransactionState } from '@/services/reports/types';

defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})

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

<style scoped>
.min-h{
    min-height: 90px;
}
</style>