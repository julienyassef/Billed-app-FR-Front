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

  describe("When I select a file", () => {

    test("it should call handleChangeFile method", () => {
      // Création d'un mock de handleChangeFile 
      const handleChangeFile = jest.fn(newBill.handleChangeFile);

      // Récupération de l'élément d'entrée de fichier de l'interface utilisateur
      const inputFile = screen.getByTestId('file');

      // Ajout d'un écouteur d'événements de changement sur l'élément d'entrée de fichier
      inputFile.addEventListener('change', handleChangeFile);

      // Simulation d'un changement de fichier dans l'élément d'entrée de fichier
      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(['testfile.png'], 'testfile.png', { type: 'image/png' }),
            new File(['testfile.jpg'], 'testfile.jpg', { type: 'image/jpg' }),
            new File(['testfile.jpeg'], 'testfile.jpeg', { type: 'image/jpeg' }),
          ]
        }
      });

      // Vérification si la méthode handleChangeFile a bien été appelée
    expect(handleChangeFile).toHaveBeenCalled();
  });
  

    test("Then ...", () => {
  
      

    })
  })
  })
})

