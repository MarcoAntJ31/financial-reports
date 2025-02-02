<template>
    <div>
        <TransaccionesFilters @apply-filters="applyFilters" @clear-filters="clearFilters" />
        <div class="charts-container mt-10">
            <v-card flat class="chart-card">
                <v-card-title>Ingresos y Gastos</v-card-title>
                <v-card-text>
                    <canvas id="barChart"></canvas>
                </v-card-text>
            </v-card>
            <v-card flat class="chart-card">
                <v-card-title>Transacciones por Categoría</v-card-title>
                <v-card-text>
                    <canvas id="pieChart"></canvas>
                </v-card-text>
            </v-card>
            <v-card flat class="chart-card">
                <v-card-title>Tendencia de Transacciones</v-card-title>
                <v-card-text>
                    <canvas id="lineChart"></canvas>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import TransaccionesFilters from "@/components/TransaccionesFilters.vue";
import Chart from "chart.js/auto";
import { FinancialReportService } from '@/services/reports/ReportService';

const reports = ref([]);
const filteredReports = ref([]);
const loading = ref(false);

let barChart, pieChart, lineChart;

const financialReportService = new FinancialReportService();

function initCharts() {
    const barChartCtx = document.getElementById("barChart");
    barChart = new Chart(barChartCtx, {
        type: "bar",
        data: {
            labels: ["Ingresos", "Gastos"],
            datasets: [
                {
                    label: "Cantidad",
                    data: calculateIncomeAndExpenses(filteredReports.value),
                    backgroundColor: ["#4caf50", "#ff5252"],
                },
            ],
        },
    });

    const pieChartCtx = document.getElementById("pieChart");
    pieChart = new Chart(pieChartCtx, {
        type: "pie",
        data: {
            labels: getUniqueCategories(filteredReports.value),
            datasets: [
                {
                    data: countTransactionsByCategory(filteredReports.value),
                    backgroundColor: generateColors(filteredReports.value.length),
                },
            ],
        },
    });

    const lineChartCtx = document.getElementById("lineChart");
    lineChart = new Chart(lineChartCtx, {
        type: "line",
        data: {
            labels: getTransactionDates(filteredReports.value),
            datasets: [
                {
                    label: "Transacciones",
                    data: getTransactionAmountsByDate(filteredReports.value),
                    borderColor: "#3f51b5",
                    fill: false,
                },
            ],
        },
    });
}

function updateCharts() {
    barChart.data.datasets[0].data = calculateIncomeAndExpenses(filteredReports.value);
    barChart.update();

    pieChart.data.labels = getUniqueCategories(filteredReports.value);
    pieChart.data.datasets[0].data = countTransactionsByCategory(filteredReports.value);
    pieChart.update();

    lineChart.data.labels = getTransactionDates(filteredReports.value);
    lineChart.data.datasets[0].data = getTransactionAmountsByDate(filteredReports.value);
    lineChart.update();
}

async function fetchReports() {
    loading.value = true;
    try {
        reports.value = await financialReportService.getReports();
        filteredReports.value = reports.value;
        initCharts();
    } catch (error) {
        console.error("Error al obtener reportes:", error);
    } finally {
        loading.value = false;
    }
}

async function applyFilters(filters) {
    loading.value = true;
    try {
        filteredReports.value = await financialReportService.getReports(filters);
        updateCharts();
    } catch (error) {
        console.error("Error al aplicar filtros:", error);
    } finally {
        loading.value = false;
    }
}

function clearFilters() {
    filteredReports.value = reports.value;
    updateCharts();
}

function calculateIncomeAndExpenses(data) {
    const income = data.filter((t) => t.tipo === "income").reduce((sum, t) => sum + t.cantidad, 0);
    const expense = data.filter((t) => t.tipo === "expense").reduce((sum, t) => sum + t.cantidad, 0);
    return [income, expense];
}

function getUniqueCategories(data) {
    return [...new Set(data.map((t) => t.categoría))];
}

function countTransactionsByCategory(data) {
    const categories = getUniqueCategories(data);
    return categories.map(
        (category) => data.filter((t) => t.categoría === category).length
    );
}

function getTransactionDates(data) {
    return [...new Set(data.map((t) => t.fecha.slice(0, 10)))];
}

function getTransactionAmountsByDate(data) {
    const dates = getTransactionDates(data);
    return dates.map((date) =>
        data.filter((t) => t.fecha.slice(0, 10) === date).reduce((sum, t) => sum + t.cantidad, 0)
    );
}

function generateColors(length) {
    const colors = [];
    for (let i = 0; i < length; i++) {
        colors.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`);
    }
    return colors;
}

onMounted(fetchReports);
</script>

<style scoped>
.charts-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-around;
}

.chart-card {
    width: 45%;
    padding: 20px;
}
</style>