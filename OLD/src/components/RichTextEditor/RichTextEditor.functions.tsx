import { Descendant } from "slate"

export const getEditorChildrenSerialized = (editorValues: Descendant[]) => {
  return JSON.stringify(editorValues)
}

export const getEditorChildrenDeserialized = (value: string) => {
  // Return a value array of children derived by splitting the string.

  const emptySlateState = [{ children: [{ text: "" }] }]
  const valueParsed = JSON.parse(value)
  return Array.isArray(valueParsed) && valueParsed.length === 0
    ? emptySlateState
    : valueParsed
}
