import type { Editor } from "obsidian";

export function selectText(editor: Editor, text: string) {
  const startOffset = editor.getValue().indexOf(text);
  const endOffset = startOffset + text.length;

  editor.setSelection(
    editor.offsetToPos(startOffset),
    editor.offsetToPos(endOffset),
  );
}
