<template>
  <VLayer ref="layerRef" :config="{ listening: false }" />
</template>

<script setup lang="ts">
import Konva from 'konva';
import type { Layer } from 'konva/lib/Layer';
import type { Stage } from 'konva/lib/Stage';
import { useTemplateRef, onBeforeUnmount } from 'vue';
import { Layer as VLayer } from 'vue-konva';
import { canvasViewGridProps } from './CanvasView.Grid.props';
import {
  getViewportBounds,
  getBlockAxisLayout,
} from './CanvasView.utils';

const props = defineProps(canvasViewGridProps);

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
  const rawX = Math.ceil(
    viewW / scale / props.cellSize.width,
  );
  const rawY = Math.ceil(
    viewH / scale / props.cellSize.height,
  );
  const cx = Math.min(rawX, props.maxCellsPerPiece);
  const cy = Math.min(rawY, props.maxCellsPerPiece);
  return {
    cellsX: cx,
    cellsY: cy,
    width: cx * props.cellSize.width,
    height: cy * props.cellSize.height,
  };
}

function createPiece(cellsX: number, cellsY: number) {
  const pw = cellsX * props.cellSize.width;
  const ph = cellsY * props.cellSize.height;

  const shape = new Konva.Shape({
    width: pw,
    height: ph,
    listening: false,
    perfectDrawEnabled: false,
    shadowEnabled: false,
    strokeEnabled: true,
    strokeHitEnabled: false,
    hitStrokeWidth: 0,
    stroke: '#e5e7eb',
    strokeWidth: 1,
    sceneFunc: (ctx, shape) => {
      const w = shape.width();
      const h = shape.height();
      ctx.beginPath();
      for (let x = 0; x < w; x += props.cellSize.width) {
        for (let y = 0; y < h; y += props.cellSize.height) {
          props.drawCell(
            ctx,
            x,
            y,
            props.cellSize.width,
            props.cellSize.height,
          );
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
    scale > activeScale * props.zoomThreshold ||
    scale < activeScale / props.zoomThreshold
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
