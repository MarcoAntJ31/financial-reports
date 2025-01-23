export interface FinancialReport {
    transaccion_id: string;
    cliente_id: string;
    cantidad: number;
    categoría: string;
    fecha: string;
    tipo: string; 
    estado: string; 
}

export type ActionType = 'edit' | 'delete';
export type TransactionType = 'income' | 'expense';
export type TransactionState = 'activada' | 'desactivada';