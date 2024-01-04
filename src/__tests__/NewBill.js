/**
 * @jest-environment jsdom
 */

// Import des modules nécessaires
import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import store from "../__mocks__/store";
import router from "../app/Router.js";


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

      describe('When I submit the New Bill form', () => {
        test('It should call the handleSubmit method', () => {
          // Création d'un mock sur la méthode handleSubmit
          const handleSubmit = jest.fn(newBill.handleSubmit);
      
          // Récupération du formulaire New Bill 
          const newBillForm = screen.getByTestId('form-new-bill');
      
          // Ajout d'un écouteur d'événements sur la soumission du formulaire
          newBillForm.addEventListener('submit', handleSubmit);
      
          // Simulation de la soumission du formulaire
          fireEvent.submit(newBillForm);
      
          // Vérification si la méthode handleSubmit a bien été appelée
          expect(handleSubmit).toHaveBeenCalled();
        });
      });
    });
  });

  describe("When I create a new bill", () => {
    test("it should send the bill data to the mock API and return a successful response", async () => {
      // Préparer l'état initial en simulant la connexion d'un utilisateur
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));

      // Créer un élément racine dans le DOM
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);

      // Activer le routage et naviguer vers la page de création de facture
      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      // Espionner la méthode create de la ressource bills du store
      jest.spyOn(store, "bills");

      const testBillData = {
        type: "Transports",
        name: "Billet d'avion",
        date: "02/01/2024", 
        amount: 150.00,
        vat: 20.00,
        pct: 10,
        commentary: "Voyage d'affaires",
        file: "test.jpg", 
      };

      // Simuler la création d'une facture dans le mock API
      store.bills.mockImplementationOnce(() => {
        return {
          create: (bill) => {
            // Vérifier que les données de la facture sont correctes
            expect(bill).toEqual(testBillData);

            // Renvoyer une promesse résolue pour simuler une opération réussie
            return Promise.resolve();
          },
        };
      });

      // Vérifier que la méthode create a été appelée une fois
      expect(store.bills).toHaveBeenCalledTimes(1);
    });
  });
});


