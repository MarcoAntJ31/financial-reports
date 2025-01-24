
import type { FinancialReport } from './types';

export class FinancialReportService {

    async getReports(filters: {
        cliente_id?: string;
        categoría?: string;
        tipo?: string;
        estado?: string;
        fechaInicio?: string;
        fechaFin?: string;
    } = {}): Promise<FinancialReport[]> {
        const baseUrl = 'http://localhost:4000/financial-reports/transactions';

        const queryParams = new URLSearchParams();

        if (filters.cliente_id) queryParams.append('cliente_id', filters.cliente_id);
        if (filters.categoría) queryParams.append('categoría', filters.categoría);
        if (filters.tipo) queryParams.append('tipo', filters.tipo);
        if (filters.estado) queryParams.append('estado', filters.estado);
        if (filters.fechaInicio) queryParams.append('fechaInicio', filters.fechaInicio);
        if (filters.fechaFin) queryParams.append('fechaFin', filters.fechaFin);

        const url = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error fetching reports');
            }

            const data = await response.json();
            return data as FinancialReport[];
        } catch (error) {
            console.error('Failed to fetch reports:', error);
            throw error;
        }
    }

    async createTransaction(report: FinancialReport): Promise<void> {
        const url = 'http://localhost:4000/financial-reports/transactions';
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(report),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(json => { throw new Error(json.message); });
                }
            });
    }

    async updateReport(id: string, report: Partial<FinancialReport>): Promise<void> {
        const url = `http://localhost:4000/financial-reports/transactions/${id}`;
        return fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(report),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(json => { throw new Error(json.message); });
                }
            });
    }

    async markReportAsInactive(transaccion_id: string): Promise<void> {
        const url = `http://localhost:4000/financial-reports/${transaccion_id}`;
        return fetch(url, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(json => {
                        throw new Error(json.message);
                    });
                }
            });
    }

    async exportReports(): Promise<void> {
        const url = 'http://localhost:4000/reports';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error exporting reports');
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'report.xlsx';
            link.click();
        } catch (error) {
            console.error('Error al exportar el reporte:', error);
            throw error;
        }
    }
    
}
