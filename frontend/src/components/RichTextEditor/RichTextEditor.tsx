import { useCallback } from "react"
import isHotkey from "is-hotkey"
import { Editable, Slate, ReactEditor } from "slate-react"
import { Descendant } from "slate"
import { Toolbar } from "./components/components"
import { MarkButton, toggleMark } from "./components/MarkButton/MarkButton"
import { BlockButton } from "./components/BlockButton/BlockButton"
import classNames from "classnames"
import "./RichTextEditor.sass"
import { EditableProps } from "slate-react/dist/components/editable"

export enum ICON_NAMES {
  // mark
  BOLD = "format_bold",
  ITALIC = "format_italic",
  UNDERLINED = "format_underlined",
  CODE = "code",
  // blocked
  LOOKS_ONE = "looks_one",
  LOOKS_TWO = "looks_two",
  FORMAT_QUOTE = "format_quote",
  FORMAT_LIST_NUMBERED = "format_list_numbered",
  FORMAT_LIST_BULLETED = "format_list_bulleted",
  FORMAT_ALIGN_LEFT = "format_align_left",
  FORMAT_ALIGN_CENTER = "format_align_center",
  FORMAT_ALIGN_RIGHT = "format_align_right",
  FORMAT_ALIGN_JUSTIFY = "format_align_justify",
}

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
} as any

const initialValueDefault: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
]

export type RichTextEditorProps = {
  className?: string
  editor: ReactEditor
  initialValue?: Descendant[]
  editableProps?: EditableProps
}

const RichTextEditor = ({
  className,
  editor,
  initialValue = initialValueDefault,
  editableProps,
}: RichTextEditorProps) => {
  const renderElement = useCallback((props: any) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

  return (
    <div className={classNames(className, "rich-text-editor")}>
      <Slate editor={editor} initialValue={initialValue}>
        {!editableProps?.readOnly && (
          <Toolbar>
            <MarkButton format="bold" icon={ICON_NAMES.BOLD} />
            <MarkButton format="italic" icon={ICON_NAMES.ITALIC} />
            <MarkButton format="underline" icon={ICON_NAMES.UNDERLINED} />
            <MarkButton format="code" icon={ICON_NAMES.CODE} />
            <BlockButton format="heading-one" icon={ICON_NAMES.LOOKS_ONE} />
            <BlockButton format="heading-two" icon={ICON_NAMES.LOOKS_TWO} />
            <BlockButton format="block-quote" icon={ICON_NAMES.FORMAT_QUOTE} />
            <BlockButton
              format="numbered-list"
              icon={ICON_NAMES.FORMAT_LIST_NUMBERED}
            />
            <BlockButton
              format="bulleted-list"
              icon={ICON_NAMES.FORMAT_LIST_BULLETED}
            />
            <BlockButton format="left" icon={ICON_NAMES.FORMAT_ALIGN_LEFT} />
            <BlockButton
              format="center"
              icon={ICON_NAMES.FORMAT_ALIGN_CENTER}
            />
            <BlockButton format="right" icon={ICON_NAMES.FORMAT_ALIGN_RIGHT} />
            <BlockButton
              format="justify"
              icon={ICON_NAMES.FORMAT_ALIGN_JUSTIFY}
            />
          </Toolbar>
        )}
        <Editable
          {...editableProps}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className="editable"
          placeholder="Enter a description"
          spellCheck
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}

const Element = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

export default RichTextEditor
