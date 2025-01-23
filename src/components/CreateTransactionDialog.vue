<template>
    <v-dialog v-model="isDialogVisible" max-width="800px">
        <v-card>
            <v-card-title class="headline">Crear nueva transacción</v-card-title>
            <v-card-text class="d-flex justify-space-between ga-9">
                <div class="w-50">
                    <v-text-field 
                        v-model="clientId" 
                        label="ID del Cliente" 
                        required
                    />
                    <v-text-field 
                        v-model="cantidad" 
                        label="Cantidad" 
                        type="number" 
                        required
                    />
                    <v-text-field 
                        v-model="categoria" 
                        label="Categoría" 
                        required
                    />
                </div>
                <div class="w-50">
                    <v-select 
                        v-model="tipo" 
                        :items="transactionTypes" 
                        label="Tipo" 
                        required
                    />
                    <v-select 
                        v-model="estado" 
                        :items="transactionStates" 
                        label="Estado" 
                        required
                    />
                    <v-date-picker 
                        v-model="fecha" 
                        label="Fecha" 
                        required
                    />
                </div>
            </v-card-text>
            <v-card-actions class="actions">
                <v-btn 
                    color="primary"
                    variant="tonal"
                    @click="cancelCreate" 
                    text
                >
                    Cancelar
                </v-btn>
                <v-btn 
                    @click="createTransaction" 
                    variant="tonal"
                    color="success"
                >
                    Crear
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
    isCreateDialogVisible: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['closeDialog', 'create-transaction']);
const isDialogVisible = ref(false);
const clientId = ref(null);
const cantidad = ref(null);
const categoria = ref(null);
const tipo = ref(null);
const estado = ref(null);
const fecha = ref(null);

const transactionTypes = ['income', 'expense']; 
const transactionStates = ['activada', 'desactivada'];

watch(() => props.isCreateDialogVisible, (newDialogVisible) => {
    isDialogVisible.value = newDialogVisible;
});

function cancelCreate() {
    emit('closeDialog');
    isDialogVisible.value = false;
}

function createTransaction() {
    if (!clientId.value || !cantidad.value || !categoria.value || !tipo.value || !estado.value || !fecha.value) {
        alert('Por favor, complete todos los campos antes de enviar la transacción.');
        return;
    }

    const newTransaction = {
        cliente_id: clientId.value,
        cantidad: cantidad.value,
        categoría: categoria.value,
        tipo: tipo.value,
        estado: estado.value,
        fecha: fecha.value,
    };

    emit('create-transaction', newTransaction);
    emit('closeDialog');
}
</script>

<style scoped>
.v-dialog .v-card {
    border-radius: 8px;
    padding: 20px;
}
</style>
