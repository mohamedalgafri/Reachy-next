"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect, useCallback, memo } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Redo,
  Undo,
  X,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TextEditorProps {
  value?: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
}

const CustomFontWeight = Extension.create({
  name: 'customFontWeight',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontWeight: {
            default: '400',
            parseHTML: element => element.style.fontWeight?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontWeight) return {}
              return {
                style: `font-weight: ${attributes.fontWeight}`,
              }
            },
          },
        },
      },
    ]
  },
});

const ToolbarButton = memo(({ onClick, active, disabled, icon: Icon, title }: any) => (
  <Button
    type="button"
    variant={active ? "default" : "ghost"}
    size="icon"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "h-8 w-8 transition-all",
      active && "bg-primary text-primary-foreground hover:bg-primary/90"
    )}
    title={title}
  >
    {typeof Icon === 'function' ? <Icon /> : <Icon className="h-4 w-4" />}
  </Button>
));
ToolbarButton.displayName = 'ToolbarButton';

export function TextEditor({
  value,
  onChange,
  className,
  placeholder = 'Start typing...'
}: TextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2]
        }
      }),
      TextStyle.configure(),
      CustomFontWeight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onChange(content);
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert min-h-[200px] focus:outline-none max-w-none p-4',
          'prose-headings:text-foreground prose-p:text-foreground',
          'prose-strong:text-foreground prose-em:text-foreground prose-li:text-foreground',
          '[&_.ProseMirror-selectednode]:ring-2 [&_.ProseMirror-selectednode]:ring-primary',
        ),
      },
    },
  });

  const setFontWeight = useCallback((weight: string) => {
    if (editor) {
      editor.chain()
        .focus()
        .unsetMark('bold')
        .unsetMark('textStyle')
        .setMark('textStyle', { fontWeight: weight })
        .run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
    }
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  }, [editor, imageUrl]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value) {
      const currentContent = editor.getHTML();
      if (currentContent !== value) {
        editor.commands.setContent(value);
      }
    }
  }, [editor, value]);

  if (!editor || !mounted) {
    return null;
  }

  return (
    <div className={cn(
      "border rounded-lg bg-background",
      "dark:border-neutral-800",
      className
    )}>
      <div className="flex flex-wrap gap-1 border-b p-1 dark:border-neutral-800 sticky top-0 bg-background z-10">
        {/* Font Weights */}
        <ToolbarButton
          onClick={() => setFontWeight('300')}
          active={editor.isActive('textStyle', { fontWeight: '300' })}
          icon={() => <span className="font-light">L</span>}
          title="Light"
        />
        <ToolbarButton
          onClick={() => setFontWeight('400')}
          active={editor.isActive('textStyle', { fontWeight: '400' })}
          icon={() => <span className="font-normal">R</span>}
          title="Regular"
        />
        <ToolbarButton
          onClick={() => {
            editor.chain()
              .focus()
              .unsetMark('textStyle')  // Remove any existing font-weight
              .toggleBold()
              .run();
          }}
          active={editor.isActive('bold')}
          icon={Bold}
          title="Bold"
        />

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Rest of the toolbar buttons */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={Italic}
          title="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          icon={UnderlineIcon}
          title="Underline"
        />

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Numbered List"
        />

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          title="Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          title="Align Right"
        />

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Links and Images */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('link') ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="flex flex-col gap-2">
              <input
                type="url"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
              <Button onClick={addLink} size="sm">
                Add Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="flex flex-col gap-2">
              <input
                type="url"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={(e) => e.key === 'Enter' && addImage()}
              />
              <Button onClick={addImage} size="sm">
                Add Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px bg-border mx-1 dark:bg-neutral-800" />

        {/* Clear Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          icon={X}
          title="Clear Formatting"
        />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={Undo}
          title="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={Redo}
          title="Redo"
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}