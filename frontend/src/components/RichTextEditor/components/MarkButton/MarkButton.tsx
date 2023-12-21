import FormatBoldIcon from "@mui/icons-material/FormatBold"
import FormatItalicIcon from "@mui/icons-material/FormatItalic"
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined"
import CodeIcon from "@mui/icons-material/Code"
import classNames from "classnames"
import { Editor } from "slate"
import { RichTextEditorButton } from "../components"
import { ICON_NAMES } from "components/RichTextEditor/RichTextEditor"
import { useSlate } from "slate-react"
import { useCallback } from "react"

export const toggleMark = (editor: any, format: any) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor: any, format: any) => {
  const marks = Editor.marks(editor)
  return marks ? (marks as any)[format] === true : false
}

export const MarkButton = ({ format, icon }: any) => {
  const editor = useSlate()
  const getIcon = useCallback((iconName: ICON_NAMES) => {
    switch (iconName) {
      case ICON_NAMES.BOLD:
        return <FormatBoldIcon />
      case ICON_NAMES.ITALIC:
        return <FormatItalicIcon />
      case ICON_NAMES.UNDERLINED:
        return <FormatUnderlinedIcon />
      case ICON_NAMES.CODE:
        return <CodeIcon />
    }
  }, [])
  const isActive = isMarkActive(editor, format)

  return (
    <RichTextEditorButton
      active={isActive}
      className={classNames(isActive && "active", "mark-button")}
      onMouseDown={(event: any) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {getIcon(icon)}
    </RichTextEditorButton>
  )
}
