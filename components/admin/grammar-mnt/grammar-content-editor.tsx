'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, ImagePlus, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read image.'));
    reader.readAsDataURL(file);
  });
}

export function GrammarContentEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true, HTMLAttributes: { class: 'max-w-full rounded-lg' } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Write the grammar lesson here...' }),
    ],
    content: value,
    editorProps: { attributes: { class: 'prose prose-sm max-w-none min-h-72 p-5 outline-none' } },
    onUpdate: ({ editor: nextEditor }) => onChange(nextEditor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return <div className='min-h-72 animate-pulse bg-secondary/40' aria-label='Loading editor' />;

  const currentEditor = editor;

  async function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setImageError('Please choose an image file.');
    if (file.size > MAX_IMAGE_SIZE) return setImageError('Image must be smaller than 5 MB.');
    try {
      currentEditor.chain().focus().setImage({ src: await fileToDataUrl(file), alt: file.name }).run();
      setImageError(null);
    } catch {
      setImageError('Could not add this image.');
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-wrap items-center gap-1 bg-secondary/40 p-2 border-border border-b'>
        <ToolbarButton label='Bold' active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold /></ToolbarButton>
        <ToolbarButton label='Italic' active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></ToolbarButton>
        <ToolbarButton label='Bullet list' active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></ToolbarButton>
        <ToolbarButton label='Numbered list' active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></ToolbarButton>
        <ToolbarButton label='Quote' active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></ToolbarButton>
        <ToolbarButton label='Add link' onClick={() => { const url = window.prompt('Enter URL'); if (url) editor.chain().focus().setLink({ href: url }).run(); }}><Link2 /></ToolbarButton>
        <ToolbarButton label='Upload image' onClick={() => inputRef.current?.click()}><ImagePlus /></ToolbarButton>
        <input ref={inputRef} type='file' accept='image/png,image/jpeg,image/gif,image/webp' className='sr-only' onChange={handleImage} />
        <span className='mx-1 bg-border w-px h-5' aria-hidden='true' />
        <ToolbarButton label='Undo' onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 /></ToolbarButton>
        <ToolbarButton label='Redo' onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 /></ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      {imageError && <p className='px-5 pb-3 text-destructive text-xs' role='alert'>{imageError}</p>}
      <p className='px-5 pb-3 text-muted-foreground text-xs'>Images are embedded directly in the lesson content. Maximum size: 5 MB.</p>
    </div>
  );
}

function ToolbarButton({ label, active, disabled, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <Button type='button' variant={active ? 'outline' : 'ghost'} size='icon' className='size-8' aria-label={label} title={label} disabled={disabled} onClick={onClick}>{children}</Button>;
}

export default GrammarContentEditor;
