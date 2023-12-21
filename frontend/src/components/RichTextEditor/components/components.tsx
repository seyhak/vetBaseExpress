import classNames from "classnames"
import React, { Ref, PropsWithChildren } from "react"
import "./components.sass"

interface BaseProps {
  className: string
  [key: string]: unknown
}
type OrNull<T> = T | null

export const RichTextEditorButton = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
        reversed: boolean
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>,
  ) => (
    <span
      {...props}
      ref={ref as any}
      className={classNames(
        className,
        "rich-text-editor-btn",
        active && "active",
        reversed ? "reversed" : "non-reversed",
      )}
    />
  ),
)

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any
      } & BaseProps
    >,
    ref: Ref<OrNull<null>>,
  ) => {
    const textLines = value.document.nodes
      .map((node: any) => node.text)
      .toArray()
      .join("\n")
    return (
      <div
        ref={ref as any}
        {...props}
        className={classNames(className, "editor-value")}
      >
        <div className="text">Slate's value as text</div>
        <div className="bottom-div">{textLines}</div>
      </div>
    )
  },
)

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>,
  ) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref as any}
      className={classNames(className, "editor-menu")}
    />
  ),
)

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>,
  ) => (
    <Menu
      {...props}
      ref={ref as any}
      className={classNames(className, "rich-text-editor-toolbar")}
    />
  ),
)
