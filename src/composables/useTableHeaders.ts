import { ref } from 'vue';

export function useTableHeaders() {
  const headers = ref([
    { text: 'ID transacción', align: 'start', value: 'transaccion_id' },
    { text: 'ID Cliente', align: 'end', value: 'cliente_id' },
    { text: 'Cantidad', align: 'end', value: 'threads' },
    { text: 'Categoría', align: 'end', value: 'baseClock' },
    { text: 'Fecha', align: 'end', value: 'boostClock' },
    { text: 'Tipo', align: 'end', value: 'tdp' },
    { text: 'Estado', align: 'end', value: 'tdp' },
  ]);

  return {
    headers
  };
}
