<template>
  <DetailsTable :rows="getEventDetails(message.event)">
    <template #header>
      <ItemHeader
        :icon="getEventIcon(message.event)"
        :text="String(message.id)"
        :tone="getEventTone(message.event)"
      >
        <slot />
      </ItemHeader>
    </template>
  </DetailsTable>
</template>

<script setup lang="ts">
import ItemHeader from '@bits/ItemHeader.vue';
import DetailsTable from '@components/DetailsTable.vue';
import { eventDetailsProps } from './EventDetails.props';
import {
  getEventDetails,
  getEventIcon,
  getEventTone,
} from './EventDetails.utils';

defineProps(eventDetailsProps);
</script>
