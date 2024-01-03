/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes.js";
import store from "../__mocks__/store";


describe("Given I am connected as an employee", () => {

  // Configuration de localStorage
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
    })
  );

  describe("When I am on NewBill Page", () => {

  // Configuration initiale avant chaque test pour une NewBill
    const html = NewBillUI()
    document.body.innerHTML = html
    let newBill = new NewBill({
      document,
      onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname }),
      store: store,
      localStorage: window.localStorage
    })

    test("Then ...", () => {
   
      

    })
  })
})


