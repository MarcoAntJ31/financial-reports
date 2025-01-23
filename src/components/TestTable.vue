<template>
    <div ref="tableContainer" class="table-container h-100">
        <v-table class="a-table h-100" hover>
            <template v-if="showSearch" v-slot:top>
                <v-text-field v-model="search" class="pa-2 mt-1" label="Busqueda general"></v-text-field>
            </template>
            <thead>
                <tr>
                    <template v-for="header in headers" :key="header.value">
                        <th class="color text-body-1">
                            {{ header.text }}
                        </th>
                    </template>
                    <th v-if="editAction" class="color text-body-1"> {{ editActionName }}</th>
                    <th v-if="deleteAction" class="color-error text-body-1"> {{ deleteActionName }}</th>
                </tr>
            </thead>
            <tbody>
                <slot :rows="filteredRows">
                    <tr v-for="row in filteredRows" :key="row.id">
                        <td 
                            v-for="(value, key) in row" 
                            v-if="key !== 'id'" 
                            :key="key"
                            :class="key === 'estado' ? (value === 'activada' ? 'status-active' : 'status-inactive') : ''"
                        >
                            {{ value }}
                        </td>
                        <td v-if="editAction">
                            <v-btn 
                                variant="tonal"
                                color="primary"
                                @click="handleAction(row, 'edit')"
                                icon="mdi-pencil"
                                :disabled="row.estado === 'desactivada'"
                            />
                        </td>
                        <td v-if="deleteAction">
                            <v-btn 
                                variant="tonal"
                                color="error"
                                @click="handleAction(row, 'delete')"
                                icon="mdi-delete"
                                :disabled="row.estado === 'desactivada'"
                            />
                        </td>
                    </tr>
                </slot>
            </tbody>
        </v-table>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    headers: {
        type: Array,
        required: true,
    },
    rows: {
        type: Array,
        required: true,
        default: () => [],
    },
    showSearch: {
        type: Boolean,
        default: false,
    },
    editAction: {
        type: Boolean,
        default: false,
    },
    deleteAction: {
        type: Boolean,
        default: false,
    },
    editActionName: {
        type: String,
        default: 'Edit',
    },
    deleteActionName: {
        type: String,
        default: 'Delete',
    },
    actionButtonName: {
        type: String,
        default: 'Action',
    },
});

const search = ref('');
const emit = defineEmits(['action']);

const filteredRows = computed(() => {
    if (!props.showSearch) {
        return props.rows;
    }

    return props.rows.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(search.value.toLowerCase())
        )
    );
});

function handleAction(row, actionType) {
    emit('action', { row, actionType });
}
</script>

<style scoped>
.color {
    color: var(--text-primary);
}

.color-error {
    color: var(--text-error);
}

.status-active{
    background-color: var(--background-success-subdued);
}

.status-inactive{
    background-color: var(--background-error-subdued);
}

</style>