import { isNotVoid } from "typed-assert";

import type { Tasks } from "../../../../types";
import { moveTaskToColumn } from "../../../../util/tasks-utils";
import { EditMode, EditOperation } from "../types";

import { create } from "./create";
import { drag } from "./drag";
import { dragAndShiftOthers, getDayKey } from "./drag-and-shift-others";
import { resize } from "./resize";
import { resizeAndShiftOthers } from "./resize-and-shift-others";
import { produce } from "immer";

const transformers: Record<EditMode, typeof drag> = {
  [EditMode.DRAG]: drag,
  [EditMode.DRAG_AND_SHIFT_OTHERS]: dragAndShiftOthers,
  [EditMode.CREATE]: create,
  [EditMode.RESIZE]: resize,
  [EditMode.RESIZE_AND_SHIFT_OTHERS]: resizeAndShiftOthers,
};

const multidayModes: Partial<EditMode[]> = [
  EditMode.DRAG,
  EditMode.DRAG_AND_SHIFT_OTHERS,
  EditMode.CREATE,
];

function isMultiday(mode: EditMode) {
  return multidayModes.includes(mode);
}

export function transform(
  baseline: Tasks,
  cursorMinutes: number,
  operation: EditOperation,
) {
  let withTaskInRightColumn = baseline;
  let destKey = getDayKey(operation.task.startTime);

  if (isMultiday(operation.mode)) {
    withTaskInRightColumn = moveTaskToColumn(
      operation.day,
      operation.task,
      baseline,
    );
    destKey = getDayKey(operation.day);
  }

  const destTasks = withTaskInRightColumn[destKey];
  const withTimeSorted = produce(destTasks.withTime, (draft) =>
    draft.sort((a, b) => a.startMinutes - b.startMinutes),
  );
  const transformFn = transformers[operation.mode];

  isNotVoid(transformFn, `No transformer for operation: ${operation.mode}`);

  return {
    ...withTaskInRightColumn,
    [destKey]: {
      ...destTasks,
      withTime: transformFn(withTimeSorted, operation.task, cursorMinutes),
    },
  };
}
