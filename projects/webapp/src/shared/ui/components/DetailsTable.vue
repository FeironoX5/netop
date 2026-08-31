<template>
  <div class="details-item inline-container column">
    <slot name="header" />
    <div class="details-table">
      <div
        class="details-row"
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
      >
        <div
          class="details-field"
          v-for="field in row"
          :key="field.label"
        >
          <span class="details-label">{{
            field.label
          }}</span>
          <span>{{ field.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { detailsTableProps } from './DetailsTable.props';

defineProps(detailsTableProps);
</script>

<style scoped>
.details-table {
  width: 100%;
  font-family: var(--f-code);
}

.details-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.details-row:not(:last-child) {
  border-bottom: var(--border);
}

.details-field {
  display: flex;
  flex-direction: column;
  gap: var(--s-gap);
  min-width: 0;
  padding: var(--s-spacing);
  overflow-wrap: anywhere;
}

.details-field + .details-field {
  border-left: var(--border);
}

.details-field:only-child {
  grid-column: 1 / -1;
}

.details-label {
  color: var(--c-placeholder-text);
  font-family: var(--f-main);
  font-size: var(--s-font-size-sm);
  text-transform: uppercase;
}
</style>
