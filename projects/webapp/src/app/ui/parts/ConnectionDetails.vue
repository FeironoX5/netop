<template>
  <DetailsTable :rows="getConnectionDetails(connection)">
    <template #header>
      <ItemHeader icon="cable" :text="connection.id" />
    </template>
  </DetailsTable>
</template>

<script setup lang="ts">
import ItemHeader from '@bits/ItemHeader.vue';
import DetailsTable from '@components/DetailsTable.vue';
import { connectionDetailsProps } from './ConnectionDetails.props';
import { getConnectionDetails } from './ConnectionDetails.utils';

defineProps(connectionDetailsProps);
</script>
