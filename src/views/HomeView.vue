<template>
    <v-layout>
        <v-main>
            <div class="main-content fill-height pa-10">
                <TransaccionesFilters 
                    @apply-filters="fetchFilteredReports" 
                    @clear-filters="fetchReportsWithoutFilters" 
                />
                <v-card 
                    flat 
                    prepend-icon="mdi-table" 
                    title="Transacciones" 
                    :loading="loading" 
                    class="mt-5"
                >
                    <template v-slot:append>
                        <v-btn 
                            color="primary" 
                            variant="elevated" 
                            @click="openCreateTransaction"
                        >
                            Nueva transacción
                        </v-btn>
                    </template>

                    <br>
                </v-card>
                <TestTable 
                    :headers="headers" 
                    :rows="formattedReports" 
                    editAction 
                    deleteAction 
                    @action="handleTableAction"
                    editActionName="Editar" 
                    deleteActionName="Eliminar" 
                />
                <div class="mt-5">
                    <v-pagination :length="10"></v-pagination>
                </div>
                <ConfirmationDialog 
                    :dialogVisible="isDialogVisible" 
                    :row="selectedRow" 
                    @closeDialog="closeDialog"
                    @confirmDelete="handleDelete" 
                    @update:dialogVisible="isDialogVisible = $event" 
                />
                <CreateTransactionDialog 
                    @create-transaction="createTransaction"
                    :isCreateDialogVisible="isCreateDialogVisible" 
                    @closeDialog="closeCreateTransactionDialog"
                    @update:isCreateDialogVisible="isCreateDialogVisible = $event" 
                />
                <EditTransactionDialog
                    :isEditDialogVisible="isEditDialogVisible"
                    :transactionToEdit="selectedRow"
                    @closeDialog="closeEditTransactionDialog"
                    @update-transaction="updateTransaction"
                />
            </div>
        </v-main>
    </v-layout>
</template>


<script setup lang="ts">
import TestTable from '@/components/TestTable.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import EditTransactionDialog from '@/components/EditTransactionDialog.vue';
import CreateTransactionDialog from '@/components/CreateTransactionDialog.vue';
import TransaccionesFilters from '@/components/TransaccionesFilters.vue';
import { useTableHeaders } from '@/composables/useTableHeaders';
import { onMounted, ref, computed } from 'vue';
import { FinancialReportService } from '@/services/reports/ReportService';
import type { FinancialReport, ActionType } from '@/services/reports/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const financialReportService = new FinancialReportService();


const reports = ref<any[]>([]);
const isDialogVisible = ref(false);
const isCreateDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const selectedRow = ref<FinancialReport | null>(null);
const loading = ref(false)
const optionSelectedNumber = ref(1);
const { headers } = useTableHeaders();

const formattedReports = computed(() =>
    reports.value.map(report => ({
        ...report,
        fecha: formatFecha(report.fecha), 
    }))
);

function formatFecha(fecha: string): string {
    return format(new Date(fecha), 'dd/MM/yyyy', { locale: es });
}

function optionSelected(option: number) {
    optionSelectedNumber.value = option;
}

function openCreateTransaction() {
    isCreateDialogVisible.value = true;
}

function closeDialog() {
    isDialogVisible.value = false;
}

function closeCreateTransactionDialog() {
    selectedRow.value = null;
    isCreateDialogVisible.value = false;
}

function closeEditTransactionDialog() {
    selectedRow.value = null;
    isEditDialogVisible.value = false;
}

async function createTransaction(newTransaction: any) {
    try {
        await financialReportService.createTransaction(newTransaction);
        reports.value = await financialReportService.getReports();
    } catch (error) {
        console.error('Error al crear la transacción:', error);
    } finally {
        isCreateDialogVisible.value = false; 
        selectedRow.value = null;
    }
}

async function updateTransaction(updatedTransaction: FinancialReport) {
    if (!updatedTransaction || !updatedTransaction.transaccion_id) {
        console.error('No se pudo identificar la transacción a actualizar.');
        return;
    }

    try {
        await financialReportService.updateReport(updatedTransaction.transaccion_id, updatedTransaction);
        reports.value = await financialReportService.getReports();
        closeEditTransactionDialog();
        selectedRow.value = null;
    } catch (error) {
        console.error('Error al actualizar la transacción:', error);
    }
}

function handleTableAction({ row, actionType }: { row: FinancialReport; actionType: ActionType }) {
    if (actionType === 'edit') {
        selectedRow.value = row;
        isEditDialogVisible.value = true;
    } else if (actionType === 'delete') {
        selectedRow.value = row;
        isDialogVisible.value = true;
    }
}

async function handleDelete(row: FinancialReport) {
    if (!row || !row.transaccion_id) {
        console.error('No se pudo identificar la transacción a eliminar.');
        return;
    }
    loading.value = true;
    try {
        await financialReportService.markReportAsInactive(row.transaccion_id);
        const updatedReports = await financialReportService.getReports();
        reports.value = updatedReports;
    } catch (error) {
        console.error('Error al marcar la transacción como inactiva:', error);
    } finally {
        loading.value = false;
        closeDialog();
    }
}

async function fetchReportsWithoutFilters() {
    try {
        loading.value = true;
        const fetchedReports = await financialReportService.getReports(); 
        reports.value = fetchedReports;
    } catch (error) {
        console.error('Error al obtener los reportes sin filtros:', error);
    } finally {
        loading.value = false;
    }
}

async function fetchFilteredReports(filters: {
    cliente_id?: string;
    categoría?: string;
    tipo?: string;
    estado?: string;
} = {}) {
    try {
        loading.value = true;
        const filteredReports = await financialReportService.getReports(filters);
        reports.value = filteredReports;
    } catch (error) {
        console.error('Error al obtener los reportes filtrados:', error);
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await fetchReportsWithoutFilters();
});
</script>

<style scoped>
.main-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.v-layout,
.v-main {
    height: 100vh;
    background-color: var(--background-secondary);
}
</style>