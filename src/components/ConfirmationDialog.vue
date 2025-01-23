<template>
    <v-dialog v-model="isDialogVisible" max-width="600px">
        <v-card>
            <v-card-title class="headline">Eliminar transacción</v-card-title>
            <v-card-text>
                <p>Esta acción no se puede deshacer. ¿Deseas continuar?</p>
            </v-card-text>
            <v-card-actions>
                <v-btn 
                    color="primary"
                    variant="tonal"
                    text 
                    @click="cancelDelete"
                >
                    Cancelar
                </v-btn>
                <v-btn 
                    color="error" 
                    variant="tonal"
                    text 
                    @click="confirmDelete"
                    >
                    Eliminar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
    dialogVisible: {
        type: Boolean,
        default: false,
    },
    row: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['closeDialog', 'confirmDelete', 'update:dialogVisible']);
const isDialogVisible = ref(false);

watch(() => props.dialogVisible, (newDialogVisible) => {
    isDialogVisible.value = newDialogVisible;
});

watch(isDialogVisible, (newValue) => {
    emit('update:dialogVisible', newValue);
});

function cancelDelete() {
    emit('closeDialog');
    isDialogVisible.value = false; 
}

function confirmDelete() {
    emit('confirmDelete', props.row);
    isDialogVisible.value = false; 
}
</script>

<style scoped>
</style>