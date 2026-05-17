<template>
  <VLayer ref="layerRef" :config="{ listening: false }" />
</template>

<script setup lang="ts">
import Konva from 'konva';
import type { Layer } from 'konva/lib/Layer';
import type { Stage } from 'konva/lib/Stage';
import { useTemplateRef, onBeforeUnmount } from 'vue';
import { Layer as VLayer } from 'vue-konva';
import { appTheme } from '@/app/App.theme';
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  PIECE_MAX_CELLS,
  ZOOM_THRESHOLD,
} from './CanvasGrid.consts';
import {
  getViewportBounds,
  getBlockAxisLayout,
  drawCell,
} from './CanvasGrid.utils';

const layerRef = useTemplateRef<{ getNode(): Layer }>(
  'layerRef',
);

let active: Konva.Shape | null = null;
let activeScale = 1;
let activeSize = { width: 0, height: 0 };

let lastXStart = Infinity,
  lastXCount = -1;
let lastYStart = Infinity,
  lastYCount = -1;

function cleanup() {
  active?.destroy();
  active = null;
}

onBeforeUnmount(cleanup);

function computeMetrics(
  viewW: number,
  viewH: number,
  scale: number,
) {
  const rawX = Math.ceil(viewW / scale / CELL_WIDTH);
  const rawY = Math.ceil(viewH / scale / CELL_HEIGHT);
  const cx = Math.min(rawX, PIECE_MAX_CELLS);
  const cy = Math.min(rawY, PIECE_MAX_CELLS);
  return {
    cellsX: cx,
    cellsY: cy,
    width: cx * CELL_WIDTH,
    height: cy * CELL_HEIGHT,
  };
}

function createPiece(cellsX: number, cellsY: number) {
  const pw = cellsX * CELL_WIDTH;
  const ph = cellsY * CELL_HEIGHT;

  const shape = new Konva.Shape({
    width: pw,
    height: ph,
    listening: false,
    perfectDrawEnabled: false,
    shadowEnabled: false,
    strokeEnabled: true,
    hitStrokeWidth: 0,
    stroke: appTheme.c.border,
    strokeWidth: 1,
    sceneFunc: (ctx, shape) => {
      const w = shape.width();
      const h = shape.height();
      ctx.beginPath();
      for (let x = 0; x < w; x += CELL_WIDTH) {
        for (let y = 0; y < h; y += CELL_HEIGHT) {
          drawCell(ctx, x, y);
        }
      }
      ctx.strokeShape(shape);
    },
  });

  shape.cache({
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  });
  return shape;
}

function resolvePiece(
  viewW: number,
  viewH: number,
  scale: number,
) {
  if (!active) {
    const m = computeMetrics(viewW, viewH, scale);
    return {
      shape: createPiece(m.cellsX, m.cellsY),
      size: { width: m.width, height: m.height },
      newScale: scale,
      switched: true,
    };
  }

  if (
    scale > activeScale * ZOOM_THRESHOLD ||
    scale < activeScale / ZOOM_THRESHOLD
  ) {
    const m = computeMetrics(viewW, viewH, scale);
    return {
      shape: createPiece(m.cellsX, m.cellsY),
      size: { width: m.width, height: m.height },
      newScale: scale,
      switched: true,
    };
  }

  return {
    shape: active,
    size: activeSize,
    newScale: activeScale,
    switched: false,
  };
}

function syncTiles(
  layer: Layer,
  xLayout: { start: number; count: number },
  yLayout: { start: number; count: number },
) {
  const needed = new Set<string>();

  for (let i = 0; i < xLayout.count; i++) {
    for (let j = 0; j < yLayout.count; j++) {
      const x = xLayout.start + i * activeSize.width;
      const y = yLayout.start + j * activeSize.height;
      needed.add(`${x},${y}`);
    }
  }

  const toDestroy: Konva.Node[] = [];
  layer.children.forEach((child) => {
    const key = `${child.x()},${child.y()}`;
    if (needed.has(key)) needed.delete(key);
    else toDestroy.push(child);
  });

  toDestroy.forEach((c) => c.destroy());

  needed.forEach((key) => {
    const [x, y] = key.split(',').map(Number);
    layer.add(active!.clone({ x, y }));
  });

  if (toDestroy.length || needed.size) {
    layer.batchDraw();
  }
}

function update(stage: Stage) {
  const layer = layerRef.value?.getNode();
  if (!layer) return;

  const viewW = stage.width();
  const viewH = stage.height();
  if (viewW === 0 || viewH === 0) return;

  const scale = stage.scaleX();
  const bounds = getViewportBounds(stage);

  const resolved = resolvePiece(viewW, viewH, scale);
  if (resolved.switched) {
    if (active && active !== resolved.shape)
      active.destroy();
    layer.destroyChildren();
    active = resolved.shape;
    activeScale = resolved.newScale;
    activeSize = resolved.size;
    lastXStart = Infinity;
    lastXCount = -1;
    lastYStart = Infinity;
    lastYCount = -1;
  }

  const xLayout = getBlockAxisLayout(
    bounds.left,
    bounds.right,
    activeSize.width,
  );
  const yLayout = getBlockAxisLayout(
    bounds.top,
    bounds.bottom,
    activeSize.height,
  );

  if (
    lastXStart === xLayout.start &&
    lastXCount === xLayout.count &&
    lastYStart === yLayout.start &&
    lastYCount === yLayout.count
  ) {
    return;
  }

  syncTiles(layer, xLayout, yLayout);
  lastXStart = xLayout.start;
  lastXCount = xLayout.count;
  lastYStart = yLayout.start;
  lastYCount = yLayout.count;
}

defineExpose({ update });
</script>
