export interface FinancialReport {
    transaccion_id: string;
    cliente_id: string;
    cantidad: number;
    categoria: string;
    fecha: string;
    tipo: string; 
    estado: string; 
}

export type ActionType = 'edit' | 'delete';