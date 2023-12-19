import { act, renderHook } from "@testing-library/react"
import { useControllers } from "./useControllers"
import { MemoryRouter } from "react-router-dom"

const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

describe("useControllers", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test("onResetSearchClick navigates to catalogue", async () => {
    const { result } = await renderHook(useControllers, {
      wrapper: MemoryRouter,
    })
    expect(result.current.search).toBeNull()
    expect(mockNavigate).not.toBeCalled()

    act(() => {
      result.current.onResetSearchClick()
    })

    expect(mockNavigate).toBeCalledWith({ pathname: "/list" })
  })
})
