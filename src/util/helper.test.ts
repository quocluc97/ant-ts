import * as helper from "./helper"
// @ponicode
describe("helper.setToLocalStorage", () => {
    test("0", () => {
        let result: any = helper.setToLocalStorage("elio@example.com", "Elio")
        expect(result).toMatchSnapshot()
        expect(result).toBe(true)
    })

    test("1", () => {
        let result: any = helper.setToLocalStorage("Elio", "elio@example.com")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = helper.setToLocalStorage("Elio", "Elio")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = helper.setToLocalStorage("Dillenberg", "elio@example.com")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = helper.setToLocalStorage("elio@example.com", "elio@example.com")
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = helper.setToLocalStorage("", "")
        expect(result).toMatchSnapshot()
    })
})
