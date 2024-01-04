/**
 * @jest-environment jsdom
 */

// Import des modules nécessaires
import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
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

    // Configuration initiale avant chaque test pour NewBill
    const html = NewBillUI();
    document.body.innerHTML = html;
    let newBill = new NewBill({
      document,
      onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname }),
      store: store,
      localStorage: window.localStorage
    });


    describe("When I select a file", () => {
      test("it should call handleChangeFile method", () => {
        // Création d'un mock de handleChangeFile
        const handleChangeFile = jest.fn(newBill.handleChangeFile);

        // Récupération de l'entrée de fichier 
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


      describe("and the file format is valid", () => {
        test('it should update the input field', () => {

          // Création d'un mock de handleChangeFile
        const handleChangeFile = jest.fn(newBill.handleChangeFile);

        // Récupération de l'entrée de fichier 
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
          // Vérification que le nom du fichier sélectionné est "testfile.png"
          expect(inputFile.files[0].name).toBe("testfile.png");
        });
      });

      
      describe("and the file format is not valid", () => {
        test('it should not update the input field', () => {
           // Création d'un mock de handleChangeFile
        const handleChangeFile = jest.fn(newBill.handleChangeFile);

        // Récupération de l'entrée de fichier 
        const inputFile = screen.getByTestId('file');

        // Ajout d'un écouteur d'événements de changement sur l'élément d'entrée de fichier
        inputFile.addEventListener('change', handleChangeFile);

        // Simulation d'un changement de fichier dans l'élément d'entrée de fichier
        fireEvent.change(inputFile, {
          target: {
              files: [
                new File(['invalidTestFile.txt'], 'invalidTestFile.txt', { type: 'image/paint' }),
              ]
            }
          })
          // Vérification que handleChangeFile a renvoyé false
          expect(handleChangeFile).toHaveReturnedWith(false)
        });
      });

      
      test("Then ...", () => {
      
      });
    });
  });
});
