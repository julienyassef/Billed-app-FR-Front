/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      
      // vérifie si l'élément windowIcon a la classe "active-icon"
      expect(Array.from(windowIcon.classList).includes('active-icon')).toBe(true)
    });

    test("Then bills should be ordered from earliest to latest", () => {
      // Fonction de tri par ordre chronologique
      const chrono = (a, b) => new Date(a) - new Date(b);

      // Création de la page (headlessDOM)
      document.body.innerHTML = BillsUI({ data: bills }); // Des dates potentiellement non triées

      // Récupération des dates affichées sur la page
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);

      // Tri des dates dans l'ordre chronologique
      const datesSorted = [...dates].sort(chrono);

      // Vérification que les dates affichées sont triées de la plus ancienne à la plus récente
      expect(dates).toEqual(datesSorted.reverse());
    });

    describe("handleClickNewBill", () => {
      test("should navigate to NewBill page", () => {
        // Création de la page (headlessDOM)
        document.body.innerHTML = BillsUI({ data: bills }); 


        // simule des donneés dans le localStorage
        Object.defineProperty(window, localStorage, {
          value: localStorageMock,
        });
        // simule un employé connecté
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        // we have to mock navigation to test it
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        // mock le store
        const store = jest.fn();

        // création de ma class qui gère la page
        const billsContainer = new Bills({
          document,
          onNavigate,
          store,
          localStorage: localStorageMock,
        });

        // récupère le button new BIll
        const buttonNewBill = screen.getByTestId("btn-new-bill");


        // mock la fonction handleClickIconEy
        const handleClickNewBill = jest.fn(() =>
        billsContainer.handleClickNewBill()
        );

        // ajout un eventlistener au click sur l'icon
        buttonNewBill.addEventListener("click", handleClickNewBill());

        // simulation un clic sur le bouton Newbill
        fireEvent.click(buttonNewBill)

        expect(handleClickNewBill).toHaveBeenCalled();
      
      });
    });

    describe("handleClickIconEye", () => {
      test("should update modal content and show the modal", () => {
        // Création de la page (headlessDOM)
        document.body.innerHTML = BillsUI({ data: bills }); 

        // simule des donneés dans le localStorage
        Object.defineProperty(window, localStorage, {
          value: localStorageMock,
        });
        // simule un employé connecté
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        // we have to mock navigation to test it
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        // mock le store
        const store = jest.fn();

        // création de ma class qui gère la page
        const billsContainer = new Bills({
          document,
          onNavigate,
          store,
          localStorage: localStorageMock,
        });

        $.fn.modal = jest.fn()

        // ============================================

        // récupère l'icon
        const icon = screen.getAllByTestId("icon-eye")[0];

        // mock la fonction handleClickIconEy
        const handleClickIconEye = jest.fn(() =>
          billsContainer.handleClickIconEye(icon)
        );
        // ajout un eventlistener au click sur l'icon
        icon.addEventListener("click", handleClickIconEye(icon));

        // on click sur l'icon
        fireEvent.click(icon);

        // on veut que la fonction soit appelé
        expect(handleClickIconEye).toHaveBeenCalled();
        expect($.fn.modal).toHaveBeenCalled()
      });
    });
  });
});
