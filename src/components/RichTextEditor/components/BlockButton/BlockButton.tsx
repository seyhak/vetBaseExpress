import LooksOneIcon from "@mui/icons-material/LooksOne"
import LooksTwoIcon from "@mui/icons-material/LooksTwo"
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered"
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter"
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight"
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify"
import { Editor, Transforms, Element as SlateElement } from "slate"
import { RichTextEditorButton } from "../components"
import { ICON_NAMES } from "components/RichTextEditor/RichTextEditor"
import { useSlate } from "slate-react"
import { useCallback } from "react"

const isBlockActive = (editor: any, format: any, blockType = "type") => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any)[blockType] === format,
    }),
  )

  return !!match
}

const LIST_TYPES = ["numbered-list", "bulleted-list"]
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"]

const toggleBlock = (editor: any, format: any) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    } as any
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

export const BlockButton = ({ format, icon }: any) => {
  const editor = useSlate()
  const getIcon = useCallback((iconName: ICON_NAMES) => {
    switch (iconName) {
      case ICON_NAMES.LOOKS_ONE:
        return <LooksOneIcon />
      case ICON_NAMES.LOOKS_TWO:
        return <LooksTwoIcon />
      case ICON_NAMES.FORMAT_QUOTE:
        return <FormatQuoteIcon />
      case ICON_NAMES.FORMAT_LIST_NUMBERED:
        return <FormatListNumberedIcon />
      case ICON_NAMES.FORMAT_LIST_BULLETED:
        return <FormatListBulletedIcon />
      case ICON_NAMES.FORMAT_ALIGN_LEFT:
        return <FormatAlignLeftIcon />
      case ICON_NAMES.FORMAT_ALIGN_CENTER:
        return <FormatAlignCenterIcon />
      case ICON_NAMES.FORMAT_ALIGN_RIGHT:
        return <FormatAlignRightIcon />
      case ICON_NAMES.FORMAT_ALIGN_JUSTIFY:
        return <FormatAlignJustifyIcon />
    }
  }, [])

  const isBlocked = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
  )

  return (
    <RichTextEditorButton
      active={isBlocked}
      onMouseDown={(event: any) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {getIcon(icon)}
    </RichTextEditorButton>
  )
}
