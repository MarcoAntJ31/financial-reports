<template>
    <v-dialog v-model="isDialogVisible" max-width="800px">
        <v-card>
            <v-card-title class="headline">Editar transacción</v-card-title>
            <v-card-text class="d-flex justify-space-between ga-9">
                <div class="w-50">
                    <v-text-field v-model="clientId" label="ID del Cliente" required />
                    <v-text-field v-model="cantidad" label="Cantidad" type="number" required />
                    <v-text-field v-model="categoria" label="Categoría" required />
                </div>
                <div class="w-50">
                    <v-select v-model="tipo" :items="transactionTypes" label="Tipo" required />
                    <v-date-picker v-model="fecha" label="Fecha" required :format="date => date.toISOString().substring(0, 10)" />
                </div>
            </v-card-text>
            <v-card-actions class="actions">
                <v-btn color="primary" variant="tonal" @click="cancelEdit">
                    Cancelar
                </v-btn>
                <v-btn @click="updateTransaction" variant="tonal" color="warning">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import type { TransactionType, TransactionState, FinancialReport } from '@/services/reports/types';

// Props
const props = defineProps({
    isEditDialogVisible: {
        type: Boolean,
        default: false,
    },
    transactionToEdit: {
        type: Object as () => FinancialReport | null,
        default: null,
    },
});


const emit = defineEmits(['closeDialog', 'update-transaction']);

const isDialogVisible = ref(false);
const clientId = ref<string | null>(null);
const cantidad = ref<number | null>(null);
const categoria = ref<string | null>(null);
const tipo = ref<TransactionType | null>(null);
const idTransaction = ref<string | null>(null);
const estado = ref<TransactionState | null>(null);
const fecha = ref<Date | null>(null);

const transactionTypes: TransactionType[] = ['income', 'expense'];
const transactionStates: TransactionState[] = ['activada', 'desactivada'];

watch(
    () => props.isEditDialogVisible,
    (newVal) => {
        isDialogVisible.value = newVal;
        if (newVal && props.transactionToEdit) {
            loadTransactionData();
        }
    }
);

function loadTransactionData() {
    if (props.transactionToEdit) {
        console.log(props.transactionToEdit)
        clientId.value = props.transactionToEdit.cliente_id || null;
        cantidad.value = props.transactionToEdit.cantidad || null;
        categoria.value = props.transactionToEdit.categoría || null;
        idTransaction.value = props.transactionToEdit.transaccion_id || null;

        tipo.value = transactionTypes.includes(props.transactionToEdit.tipo as TransactionType)
            ? (props.transactionToEdit.tipo as TransactionType)
            : null;

        estado.value = ['activada', 'desactivada'].includes(props.transactionToEdit.estado as TransactionState)
            ? (props.transactionToEdit.estado as TransactionState)
            : null;

        fecha.value = new Date(props.transactionToEdit.fecha) || null;
    }
}

function resetForm() {
    clientId.value = null;
    cantidad.value = null;
    categoria.value = null;
    tipo.value = null;
    estado.value = null;
    fecha.value = null;
}

function cancelEdit() {
    emit('closeDialog');
    isDialogVisible.value = false;
    resetForm();
}

function updateTransaction() {
    if (!clientId.value || !cantidad.value || !categoria.value || !tipo.value || !estado.value || !fecha.value) {
        alert('Por favor, complete todos los campos antes de guardar la transacción.');
        return;
    }

    const updatedTransaction = {
        transaccion_id: idTransaction.value,
        cliente_id: clientId.value,
        cantidad: cantidad.value,
        categoría: categoria.value,
        tipo: tipo.value,
        estado: estado.value,
        fecha: fecha.value,
    };

    emit('update-transaction', updatedTransaction);
    emit('closeDialog');
    resetForm();
}
</script>

<style scoped>
.v-dialog .v-card {
    border-radius: 8px;
    padding: 20px;
}
</style>
