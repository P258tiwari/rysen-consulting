import {
  Bold,
  Eraser,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type ToolbarButtonProps = {
  label: string;
  command: string;
  value?: string;
  children: ReactNode;
};

function normaliseLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function RichTextEditor({ value, onChange, placeholder = "Write the full article…" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor || editor.innerHTML === value) return;
    editor.innerHTML = value;
  }, [value]);

  function syncValue() {
    const editor = editorRef.current;
    if (!editor) return;
    onChange(editor.textContent?.trim() ? editor.innerHTML : "");
  }

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncValue();
  }

  function addLink() {
    const link = window.prompt("Enter the destination URL");
    if (link === null) return;
    const href = normaliseLink(link);
    if (href) runCommand("createLink", href);
  }

  function ToolbarButton({ label, command, value: commandValue, children }: ToolbarButtonProps) {
    return (
      <button
        type="button"
        title={label}
        aria-label={label}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => runCommand(command, commandValue)}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-rysen-charcoal/70 transition hover:bg-white hover:text-rysen-orange"
      >
        {children}
      </button>
    );
  }

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-rysen-ink/10 bg-white transition focus-within:border-rysen-orange focus-within:ring-4 focus-within:ring-rysen-orange/10">
      <div className="flex flex-wrap items-center gap-1 border-b border-rysen-ink/10 bg-rysen-soft/70 p-2" role="toolbar" aria-label="Article formatting">
        <ToolbarButton label="Undo" command="undo"><Undo2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Redo" command="redo"><Redo2 className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-6 w-px bg-rysen-ink/10" aria-hidden="true" />
        <select
          aria-label="Text style"
          defaultValue="p"
          onChange={(event) => runCommand("formatBlock", event.target.value)}
          className="h-9 rounded-md border border-rysen-ink/10 bg-white px-3 text-sm font-semibold text-rysen-charcoal outline-none"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <span className="mx-1 h-6 w-px bg-rysen-ink/10" aria-hidden="true" />
        <ToolbarButton label="Bold" command="bold"><Bold className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Italic" command="italic"><Italic className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Underline" command="underline"><Underline className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Bulleted list" command="insertUnorderedList"><List className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Numbered list" command="insertOrderedList"><ListOrdered className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Quote" command="formatBlock" value="blockquote"><Quote className="h-4 w-4" /></ToolbarButton>
        <button
          type="button"
          title="Add link"
          aria-label="Add link"
          onMouseDown={(event) => event.preventDefault()}
          onClick={addLink}
          className="grid h-9 w-9 place-items-center rounded-md text-rysen-charcoal/70 transition hover:bg-white hover:text-rysen-orange"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <ToolbarButton label="Clear formatting" command="removeFormat"><Eraser className="h-4 w-4" /></ToolbarButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-label="Article body"
        aria-multiline="true"
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={syncValue}
        onBlur={syncValue}
        className="rich-editor min-h-[380px] px-5 py-4 text-base leading-8 text-rysen-charcoal outline-none"
      />
    </div>
  );
}
