/**
 * @jest-environment jsdom
 */

// Import des modules nécessaires
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import BillsUI from "../views/BillsUI.js";

jest.mock("../app/store", () => mockStore);

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
      onNavigate: (pathname) =>
        (document.body.innerHTML = ROUTES({ pathname })),
      store: mockStore,
      localStorage: window.localStorage,
    });

    describe("When I select a file", () => {
      test("it should call handleChangeFile method", () => {
        // Création d'un mock de handleChangeFile
        const handleChangeFile = jest.fn(newBill.handleChangeFile);

        // Récupération de l'entrée de fichier
        const inputFile = screen.getByTestId("file");

        // Ajout d'un écouteur d'événements de changement sur l'élément d'entrée de fichier
        inputFile.addEventListener("change", handleChangeFile);

        // Simulation d'un changement de fichier dans l'élément d'entrée de fichier
        fireEvent.change(inputFile, {
          target: {
            files: [
              new File(["testfile.png"], "testfile.png", { type: "image/png" }),
              new File(["testfile.jpg"], "testfile.jpg", { type: "image/jpg" }),
              new File(["testfile.jpeg"], "testfile.jpeg", {
                type: "image/jpeg",
              }),
            ],
          },
        });

        // Vérification si la méthode handleChangeFile a bien été appelée
        expect(handleChangeFile).toHaveBeenCalled();
      });

      describe("and the file format is valid", () => {
        test("it should update the input field", () => {
          // Création d'un mock de handleChangeFile
          const handleChangeFile = jest.fn(newBill.handleChangeFile);

          // Récupération de l'entrée de fichier
          const inputFile = screen.getByTestId("file");

          // Ajout d'un écouteur d'événements de changement sur l'élément d'entrée de fichier
          inputFile.addEventListener("change", handleChangeFile);

          // Simulation d'un changement de fichier dans l'élément d'entrée de fichier
          fireEvent.change(inputFile, {
            target: {
              files: [
                new File(["testfile.png"], "testfile.png", {
                  type: "image/png",
                }),
                new File(["testfile.jpg"], "testfile.jpg", {
                  type: "image/jpg",
                }),
                new File(["testfile.jpeg"], "testfile.jpeg", {
                  type: "image/jpeg",
                }),
              ],
            },
          });
          // Vérification que le nom du fichier sélectionné est "testfile.png"
          expect(inputFile.files[0].name).toBe("testfile.png");
        });
      });

      describe("and the file format is not valid", () => {
        test("it should not update the input field", () => {
          // Création d'un mock de handleChangeFile
          const handleChangeFile = jest.fn(newBill.handleChangeFile);

          // Récupération de l'entrée de fichier
          const inputFile = screen.getByTestId("file");

          // Ajout d'un écouteur d'événements de changement sur l'élément d'entrée de fichier
          inputFile.addEventListener("change", handleChangeFile);

          // Simulation d'un changement de fichier dans l'élément d'entrée de fichier
          fireEvent.change(inputFile, {
            target: {
              files: [
                new File(["invalidTestFile.txt"], "invalidTestFile.txt", {
                  type: "image/paint",
                }),
              ],
            },
          });
          // Vérification que handleChangeFile a renvoyé false
          expect(handleChangeFile).toHaveReturnedWith(false);
        });
      });

      describe("When I submit the New Bill form", () => {
        test("It should call the handleSubmit method", () => {
          // Création d'un mock sur la méthode handleSubmit
          const handleSubmit = jest.fn(newBill.handleSubmit);

          // Récupération du formulaire New Bill
          const newBillForm = screen.getByTestId("form-new-bill");

          // Ajout d'un écouteur d'événements sur la soumission du formulaire
          newBillForm.addEventListener("submit", handleSubmit);

          // Simulation de la soumission du formulaire
          fireEvent.submit(newBillForm);

          // Vérification si la méthode handleSubmit a bien été appelée
          expect(handleSubmit).toHaveBeenCalled();
        });
      });
    });
  });

  // POST integration tests
  describe("Given I am a user connected as Employee", () => {
    describe("When I create new bill", () => {
      test("display employee page from API POST ", async () => {
        // Espionnage de la méthode bills() du mockStore
        jest.spyOn(mockStore, "bills");

        // Configuration du type d'utilisateur dans le localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );

        // Création de l'élément racine
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);

        // Navigation vers le tableau de bord
        router();
        window.onNavigate(ROUTES_PATH.NewBill);

        // Vérifie si l'élément contenant le texte "Mes notes de frais" est présent dans le contenu rendu à l'écran
        expect(screen.getByText("Mes notes de frais")).toBeTruthy();
        // Vérifie la présence du bouton: nouvelle note de frais
        expect(screen.getByTestId("btn-new-bill")).toBeTruthy();
      });
    });
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        // Espionnage de la méthode bills() du mockStore
        jest.spyOn(mockStore, "bills");

        // Configuration du localStorage
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );

        // Création de l'élément racine
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        // Navigation vers le tableau de bord
        router();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        jest.spyOn(mockStore, "bills");
        jest.spyOn(console, "error").mockImplementation(() => {}); // Prevent Console.error jest error

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        Object.defineProperty(window, "location", {
          value: { hash: ROUTES_PATH["NewBill"] },
        });

        window.localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee" })
        );
        document.body.innerHTML = `<div id="root"></div>`;
        router();

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        mockStore.bills.mockImplementationOnce(() => {
          return {
            update: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        // Soumettre le formulaire
        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        
        await new Promise(process.nextTick);
        expect(console.error).toBeCalled();
      });
    });
  });
});
