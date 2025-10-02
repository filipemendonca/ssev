"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { editorTheme } from "./editor/themes/editor-theme";
import { nodes } from "./blocks/editor-x/nodes";
import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { Dispatch, SetStateAction } from "react";
import { Editor } from "./blocks/editor-x/editor";

interface RichTextAreaProps {
  editorState: SerializedEditorState<SerializedLexicalNode>;
  setEditorState: Dispatch<
    SetStateAction<SerializedEditorState<SerializedLexicalNode> | undefined>
  >;
}

export function RichTextArea({
  editorState,
  setEditorState,
}: Readonly<RichTextAreaProps>) {
  const editorConfig: InitialConfigType = {
    namespace: "RichTextEditor",
    theme: editorTheme,
    nodes,
    onError: (error: Error) => {
      console.error(error);
    },
  };

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
        }}
      >
        <Editor
          editorSerializedState={editorState}
          onSerializedChange={(value) => setEditorState(value)}
        />
      </LexicalComposer>
    </div>
  );
}
