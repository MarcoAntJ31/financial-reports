<template>
    <v-layout>
        <v-main>
            <div class="main-content pa-10">
                <TransaccionesFilters 
                    @apply-filters="fetchFilteredReports" 
                    @clear-filters="fetchReportsWithoutFilters" 
                    :loading="loading" 
                />
                <v-card 
                    flat 
                    prepend-icon="mdi-table" 
                    title="Transacciones" 
                    :loading="loading" 
                    class="mt-5 min-h"
                >
                    <template v-slot:append>
                        <div class="d-flex ga-3">
                            <v-btn 
                                color="primary" 
                                prepend-icon="mdi-plus"
                                variant="elevated"
                                :loading="loading" 
                                @click="openCreateTransaction"
                            >
                                Nueva transacción
                            </v-btn>
                            <v-btn 
                                color="secondary" 
                                prepend-icon="mdi-export"
                                variant="elevated" 
                                :loading="loading"
                                @click="exportReports"
                            >
                                Exportar
                            </v-btn>
                        </div>
                    </template>
                    <br>
                </v-card>
                <div class="table-container">
                    <TestTable 
                        :headers="headers" 
                        :rows="formattedReports" 
                        editAction 
                        deleteAction 
                        @action="handleTableAction"
                        editActionName="Editar" 
                        deleteActionName="Eliminar" 
                    />
                </div>
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
import { useToast } from 'vue-toastification'; 
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

const toast = useToast();

const financialReportService = new FinancialReportService();

const reports = ref<any[]>([]);
const isDialogVisible = ref(false);
const isCreateDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const selectedRow = ref<FinancialReport | null>(null);
const loading = ref(false);
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
    loading.value = true;
    try {
        await financialReportService.createTransaction(newTransaction);
        await new Promise(resolve => setTimeout(resolve, 1500));
        reports.value = await financialReportService.getReports();
        toast.success('Transacción creada exitosamente.');
    } catch (error) {
        console.error('Error al crear la transacción:', error);
        toast.error('Hubo un error al crear la transacción.'); 
    } finally {
        isCreateDialogVisible.value = false; 
        selectedRow.value = null;
        loading.value = false;
    }
}

async function updateTransaction(updatedTransaction: FinancialReport) {
    if (!updatedTransaction || !updatedTransaction.transaccion_id) {
        console.error('No se pudo identificar la transacción a actualizar.');
        toast.error('No se pudo identificar la transacción a actualizar.');  
        return;
    }   
    loading.value = true;
    try {
        await financialReportService.updateReport(updatedTransaction.transaccion_id, updatedTransaction);
        await new Promise(resolve => setTimeout(resolve, 1500));
        reports.value = await financialReportService.getReports();
        closeEditTransactionDialog();
        selectedRow.value = null;
        toast.success('Transacción actualizada exitosamente.'); 
    } catch (error) {
        console.error('Error al actualizar la transacción:', error);
        toast.error('Hubo un error al actualizar la transacción.'); 
    } finally {
        loading.value = false;
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
        toast.error('No se pudo identificar la transacción a eliminar.');  
        return;
    }
    loading.value = true;
    try {
        await financialReportService.markReportAsInactive(row.transaccion_id);
        const updatedReports = await financialReportService.getReports();
        reports.value = updatedReports;
        toast.success('Transacción eliminada correctamente.');  
    } catch (error) {
        console.error('Error al marcar la transacción como inactiva:', error);
        toast.error('Hubo un error al eliminar la transacción.');  
    } finally {
        loading.value = false;
        closeDialog();
    }
}

async function fetchReportsWithoutFilters() {
    try {
        loading.value = true;
        await new Promise(resolve => setTimeout(resolve, 1500));
        const fetchedReports = await financialReportService.getReports(); 
        reports.value = fetchedReports;
    } catch (error) {
        console.error('Error al obtener los reportes sin filtros:', error);
        toast.error('Hubo un error al obtener los reportes.'); 
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
        await new Promise(resolve => setTimeout(resolve, 500));
        const filteredReports = await financialReportService.getReports(filters);
        reports.value = filteredReports;
    } catch (error) {
        console.error('Error al obtener los reportes filtrados:', error);
        toast.error('Hubo un error al obtener los reportes filtrados.');
    } finally {
        loading.value = false;
    }
}

async function exportReports() {
    loading.value = true;
    try {
        await financialReportService.exportReports();
        toast.success('Reportes exportados exitosamente.');
    } catch (error) {
        console.error('Error al exportar los reportes:', error);
        toast.error('Hubo un error al exportar los reportes.'); 
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
    overflow-y: auto;
    overflow-x: hidden;
    height: 100vh;
}

.v-layout,
.v-main {
    height: 100%;
    background-color: var(--background-secondary);
}

.min-h{
    min-height: 60px;
}

.table-container {
    max-height: calc(100vh - 250px);
    overflow-y: auto; 
    overflow-x: hidden;
}

@media (max-width: 768px) {
    .table-container {
        max-height: calc(100vh - 230px);
    }
}
</style>