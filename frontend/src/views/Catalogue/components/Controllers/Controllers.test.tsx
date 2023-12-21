import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Controllers, ControllersProps } from "./Controllers"

describe("Controllers", () => {
  let props: ControllersProps
  beforeEach(() => {
    props = {
      isItemSelected: false,
      isEditModeOn: false,
      onAddClick: jest.fn(),
      onSaveClick: jest.fn(),
      onEditClick: jest.fn(),
      onDeleteClick: jest.fn(),
    }
  })
  test.each([
    ["onAddClick", "add"],
    ["onSaveClick", "save"],
    ["onEditClick", "edit"],
  ])("no search, buttons %s", async (funcName, label) => {
    props.isItemSelected = true
    props.isEditModeOn = true

    render(
      <MemoryRouter>
        <Controllers {...props} />
      </MemoryRouter>,
    )

    const btn = screen.getByLabelText(label)
    await fireEvent.click(btn)
    const func = props[funcName as keyof ControllersProps]
    await waitFor(() => {
      expect(func).toBeCalled()
    })
  })
  test("no search behavior", () => {
    const view = render(
      <MemoryRouter>
        <Controllers {...props} />
      </MemoryRouter>,
    )

    expect(view.asFragment()).toMatchSnapshot()
    expect(screen.queryByText("Results for")).toBeFalsy()
    expect(screen.queryByLabelText("reset-search")).toBeFalsy()
  })
  test("search behavior", () => {
    render(
      <MemoryRouter initialEntries={["/list?search=banan"]}>
        <Controllers {...props} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Results for "banan"')).toBeInTheDocument()
    expect(screen.getByLabelText("reset-search")).toBeInTheDocument()
  })
  test("no item selected behavior", () => {
    render(
      <MemoryRouter>
        <Controllers {...props} />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText("add")).toBeInTheDocument()
    expect(screen.queryByLabelText("save")).toBeFalsy()
    expect(screen.queryByLabelText("edit")).toBeFalsy()
    expect(screen.queryByLabelText("delete")).toBeFalsy()
  })
  test("item selected behavior not in editmode", () => {
    props.isItemSelected = true

    render(
      <MemoryRouter>
        <Controllers {...props} />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText("add")).toBeInTheDocument()
    expect(screen.getByLabelText("edit")).toBeInTheDocument()
    expect(screen.getByLabelText("delete")).toBeInTheDocument()
    expect(screen.queryByLabelText("save")).toBeFalsy()
  })
  test("item selected behavior, is in editmode", () => {
    props.isItemSelected = true
    props.isEditModeOn = true

    render(
      <MemoryRouter>
        <Controllers {...props} />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText("add")).toBeInTheDocument()
    expect(screen.getByLabelText("edit")).toBeInTheDocument()
    expect(screen.getByLabelText("delete")).toBeInTheDocument()
    expect(screen.getByLabelText("save")).toBeInTheDocument()
  })
})
