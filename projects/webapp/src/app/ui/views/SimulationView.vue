<template>
  <div class="simulation-view inline-container column full">
    <TabbedGroup
      :items="SIMULATION_TABS"
      v-slot="{ activeTab }"
    >
      <div class="input-area inline-container row full">
        <Button icon="search" isQuiet disabled />
        <Textarea
          class="search-input"
          placeholder="Search simulation"
          :rows="1"
          v-model="query"
        />
        <ButtonSections v-if="activeTab === 'entities'">
          <Button
            icon="git-branch"
            :isActive="entityView === 'tree'"
            :isSelectable="true"
            @click="entityView = 'tree'"
          />
          <Button
            icon="list"
            :isActive="entityView === 'list'"
            :isSelectable="true"
            @click="entityView = 'list'"
          />
        </ButtonSections>
      </div>

      <div
        v-if="
          activeTab === 'entities' && entityView === 'tree'
        "
        class="content-area tree-view"
      >
        <TreeList :items="entityEntries">
          <template #item="{ item: entry }">
            <Button icon="box" :text="entry.text" />
          </template>
        </TreeList>
      </div>

      <div
        v-else-if="activeTab === 'entities'"
        class="content-area list-view"
      >
        <EntityDetails
          v-for="entry in entityEntries"
          :key="entry.path"
          :entity="entry.entity"
          :path="entry.path"
        />
      </div>

      <div v-else class="content-area list-view">
        <ConnectionDetails
          v-for="connection in connectionEntries"
          :key="connection.id"
          :connection="connection"
        />
      </div>
    </TabbedGroup>
  </div>
</template>

<script setup lang="ts">
import Button from '@bits/Button.vue';
import ButtonSections from '@bits/ButtonSections.vue';
import Textarea from '@bits/Textarea.vue';
import TabbedGroup from '@components/TabbedGroup.vue';
import TreeList from '@components/TreeList.vue';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useSimulationStore } from '@/app/stores/simulationStore';
import ConnectionDetails from '../parts/ConnectionDetails.vue';
import EntityDetails from '../parts/EntityDetails.vue';
import { SIMULATION_TABS } from './SimulationView.consts';
import type { EntityView } from './SimulationView.types';
import {
  getConnections,
  getEntityEntries,
} from './SimulationView.utils';

const entityView = ref<EntityView>('tree');
const query = ref('');

const simulationStore = useSimulationStore();
const { entities, connections } =
  storeToRefs(simulationStore);
const entityEntries = computed(() =>
  getEntityEntries(entities.value, query.value),
);
const connectionEntries = computed(() =>
  getConnections(connections.value, query.value),
);
</script>

<style scoped>
.simulation-view {
  min-height: 0;
  background: var(--c-l0-bg);
}

.input-area {
  flex: 0 0 auto;
  align-items: center;
  gap: var(--s-gap);
  padding: var(--s-spacing);
  border-bottom: var(--border);
}

.input-area {
  font-family: var(--f-code);
}

.search-input {
  flex: 1 1 auto;
  min-width: 0;
}

.content-area {
  flex: 1 1 auto;
  min-height: 0;
  padding-bottom: 30vh;
  overflow: auto;
}

:deep(.details-item:last-child) {
  border-bottom: var(--border);
}
</style>
