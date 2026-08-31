<template>
  <DetailsTable :rows="getEntityDetails(entity, path)">
    <template #header>
      <ItemHeader
        icon="box"
        :text="getEntityDisplayText(entity)"
      />
    </template>
  </DetailsTable>
</template>

<script setup lang="ts">
import ItemHeader from '@bits/ItemHeader.vue';
import DetailsTable from '@components/DetailsTable.vue';
import { getEntityDisplayText } from '@/app/utils/simulation';
import { entityDetailsProps } from './EntityDetails.props';
import { getEntityDetails } from './EntityDetails.utils';

defineProps(entityDetailsProps);
</script>
