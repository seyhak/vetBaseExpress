import { act, renderHook } from "@testing-library/react"
import { useSyncSection } from "./useSyncSection"
import { getListCatalogueResolvedValue } from "tests/mocks"
import * as utils from "./useSyncSection.utils"

const mockUseContext = jest.fn()
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: () => mockUseContext(),
}))
const mockProcessItemsAndDownloadAsCsv = jest.fn()
const mockHandleCsvImport = jest.fn()

const mockGetListCatalogue = jest.fn()
const anyWindow = window as any

describe("useSyncSection", () => {
  let spy
  const mockSetSnackbarState = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    anyWindow.electronAPI = {
      getListCatalogue: mockGetListCatalogue,
    }
    mockGetListCatalogue.mockResolvedValue(getListCatalogueResolvedValue)
    mockUseContext.mockReturnValue({ setSnackbarState: mockSetSnackbarState })
    spy = jest.spyOn(utils, "processItemsAndDownloadAsCsv")
    spy.mockImplementation(mockProcessItemsAndDownloadAsCsv)
  })
  test("initial state", () => {
    const { result } = renderHook(useSyncSection)
    expect(result.current).toEqual({
      isLoading: false,
      onExportToCSVClick: expect.any(Function),
      onImportFromCSVChange: expect.any(Function),
    })
  })
  describe("onExportToCSVClick", () => {
    test("success", async () => {
      const { result } = renderHook(useSyncSection)
      expect(result.current).toEqual({
        isLoading: false,
        onExportToCSVClick: expect.any(Function),
        onImportFromCSVChange: expect.any(Function),
      })
      await act(async () => {
        await result.current.onExportToCSVClick()
      })
      expect(mockProcessItemsAndDownloadAsCsv).toBeCalled()

      expect(result.current).toEqual({
        isLoading: false,
        onExportToCSVClick: expect.any(Function),
        onImportFromCSVChange: expect.any(Function),
      })
      expect(mockSetSnackbarState).toBeCalledWith({
        type: "success",
        isOpened: true,
        message: "Export successful!",
      })
    })
  })
  describe("onImportFromCSVChange", () => {
    beforeEach(() => {
      spy = jest.spyOn(utils, "handleCsvImport")
      spy.mockImplementation(mockHandleCsvImport)
    })
    test("success", async () => {
      const { result } = renderHook(useSyncSection)
      const event: any = { target: { files: [] } }

      expect(result.current).toEqual({
        isLoading: false,
        onExportToCSVClick: expect.any(Function),
        onImportFromCSVChange: expect.any(Function),
      })
      await act(async () => {
        await result.current.onImportFromCSVChange(event)
      })
      expect(mockHandleCsvImport).toBeCalled()

      expect(result.current).toEqual({
        isLoading: false,
        onExportToCSVClick: expect.any(Function),
        onImportFromCSVChange: expect.any(Function),
      })
      expect(mockSetSnackbarState).toBeCalledWith({
        isOpened: true,
        message: "Import Succeeded",
        type: "success",
      })
    })
    test("error", async () => {
      const { result } = renderHook(useSyncSection)
      const event: any = { target: { files: [] } }
      const mockConsole = jest.fn()
      jest.spyOn(console, "error").mockImplementation((arg) => mockConsole(arg))
      mockHandleCsvImport.mockImplementation(() => {
        throw Error()
      })

      expect(result.current).toEqual({
        isLoading: false,
        onExportToCSVClick: expect.any(Function),
        onImportFromCSVChange: expect.any(Function),
      })
      await act(async () => {
        await result.current.onImportFromCSVChange(event)
      })
      expect(mockHandleCsvImport).toBeCalled()

      expect(result.current).toEqual({
        isLoading: false,
        onExportToCSVClick: expect.any(Function),
        onImportFromCSVChange: expect.any(Function),
      })
      expect(mockSetSnackbarState).toBeCalledWith({
        isOpened: true,
        message: "Import failed",
        type: "error",
      })
      expect(mockConsole).toBeCalledWith(expect.any(Error))
    })
  })
})
