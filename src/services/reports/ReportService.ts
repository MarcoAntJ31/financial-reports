
import type { FinancialReport } from './types';

export class FinancialReportService {

    async getReports(): Promise<FinancialReport[]> {
        const url = 'http://localhost:4000/financial-reports/transactions';

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
        const url = `${API_URL}/financial-reports/${id}`;
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
}
