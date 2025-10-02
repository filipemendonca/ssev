"use client";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, SerializedEditorState } from "lexical";

import { TooltipProvider } from "@/components/ui/tooltip";

import { Plugins } from "./plugins";

export function Editor({
  onChange,
  onSerializedChange,
}: Readonly<{
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}>) {
  return (
    <TooltipProvider>
      <Plugins />

      <OnChangePlugin
        ignoreSelectionChange={true}
        onChange={(editorState) => {
          onChange?.(editorState);
          onSerializedChange?.(editorState.toJSON());
        }}
      />
    </TooltipProvider>
  );
}
