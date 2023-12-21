import { useCallback, useState } from "react"
import { getEditorChildrenSerialized } from "components/RichTextEditor/RichTextEditor.functions"
import { useRichTextEditor } from "components/RichTextEditor/useRichTextEditor"
import { useCategoriesMultiSelectContext } from "components/CategoriesMultiSelect/useCategoriesMultiSelectContext"
import { AddItemDialogProps } from "./AddItemDialog"

export type UseAddItemDialogProps = {
  handleModalClose: AddItemDialogProps["handleModalClose"]
}

export const useAddItemDialog = ({
  handleModalClose,
}: UseAddItemDialogProps) => {
  const [name, setName] = useState("")
  const { editor } = useRichTextEditor()
  const categoriesMultiSelectContext = useCategoriesMultiSelectContext()

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }
  const resetState = useCallback(() => {
    categoriesMultiSelectContext.setCategoriesMultiSelectValue([])
  }, [categoriesMultiSelectContext])

  const onConfirmClick = useCallback(async () => {
    const serializedValue = getEditorChildrenSerialized(editor.children)
    try {
      await (window as any).electronAPI.createItem({
        name,
        description: serializedValue,
        categoryIds:
          categoriesMultiSelectContext.categoriesMultiSelectValue.map(
            (c) => c.id,
          ),
      })
      categoriesMultiSelectContext.setCategoriesMultiSelectValue([])
      resetState()
      handleModalClose?.({} as Event, "backdropClick")
    } catch (e) {
      console.error(e)
    }
  }, [categoriesMultiSelectContext, resetState, handleModalClose, editor, name])

  const onClose = useCallback(() => {
    resetState()
    handleModalClose?.({} as Event, "backdropClick")
  }, [resetState, handleModalClose])

  return {
    onNameChange,
    editor,
    onConfirmClick,
    categoriesMultiSelectContext,
    onClose,
  }
}
