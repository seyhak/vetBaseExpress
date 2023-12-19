import { Catalogue } from "./Catalogue"
import { render, screen, fireEvent } from "@testing-library/react"
import { useCatalogue } from "./useCatalogue"
import { getListCatalogueResolvedValue } from "tests/mocks"

let mockUseCatalogue = jest.fn()
jest.mock("./useCatalogue", () => ({
  useCatalogue: () => mockUseCatalogue(),
}))

describe("Catalogue", () => {
  let mockReturnValue: any
  const onItemClick = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    mockReturnValue = {
      onNameChange: jest.fn(),
      onSaveClick: jest.fn(),
      onEditClick: jest.fn(),
      onDeleteClick: jest.fn(),
      onItemClick,
      onAddClick: jest.fn(),
      itemDetailed: null,
      editor: null,
      isEditModeOn: false,
      itemsList: getListCatalogueResolvedValue,
      selectedItem: null,
      isAddingModalOpened: false,
      handleAddModalClose: jest.fn(),
    }
    mockUseCatalogue.mockReturnValue(mockReturnValue)
  })
  it("renders properly no item selected", () => {
    const { asFragment } = render(<Catalogue />)

    expect(screen.getByText("Pick something from the list")).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
  // TODO
  // it.each(getListCatalogueResolvedValue.map(i => i))("renders properly item selected - %s", (item) => {
  //   jest.spyOn()
  //   mockReturnValue = {
  //     ...mockReturnValue,
  //     selectedItem: item,
  //     itemDetailed: item,
  //   }
  //   mockUseCatalogue.mockReturnValue(mockReturnValue)
  //   const { asFragment } = render(<Catalogue/>)

  //   expect(screen.queryByText('Pick something from the list')).not.toBeInTheDocument()
  //   expect(asFragment()).toMatchSnapshot()
  // })
  it.each(
    getListCatalogueResolvedValue.map((i, idx) => [
      i.name,
      getListCatalogueResolvedValue[idx],
    ]),
  )("should call on Item Click properly - %s", async (name, expected) => {
    const { baseElement } = render(<Catalogue />)

    expect(baseElement).toBeInTheDocument()
    const itemInList = screen.queryByText(name)

    expect(itemInList).toBeInTheDocument()
    await fireEvent.click(itemInList!)
    expect(onItemClick).toBeCalledWith(expected)
  })
})
