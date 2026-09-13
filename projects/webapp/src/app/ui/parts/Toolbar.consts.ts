import type { ButtonGroupItemData } from '@components/ButtonGroup.types';
import { CanvasCursorMode } from '@/app/stores/canvasStore';

export const CURSOR_TOOLS = [
  {
    icon: 'mouse-pointer-2',
    mode: CanvasCursorMode.Select,
  },
  { icon: 'hand', mode: CanvasCursorMode.Drag },
  { icon: 'cable', mode: CanvasCursorMode.Connect },
  { icon: 'message-circle', mode: CanvasCursorMode.Note },
] as const satisfies readonly (ButtonGroupItemData & {
  mode: CanvasCursorMode;
})[];
