/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";


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
      //to-do write expect expression
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

describe('handleClickNewBill', () => {
  test('should navigate to NewBill page', () => {
  
   
    // simulation un clic sur le bouton Newbill
    fireEvent.click(document.querySelector('button[data-testid="btn-new-bill"]'));

    
  });
});

describe("handleClickIconEye", () => {
  test("should update modal content and show the modal", () => {
    // Ajouter l'icône et la modal au DOM
    document.body.innerHTML = `
      <div id="icon" data-bill-url="test-url.jpg"></div>
      <div id="modaleFile"></div>
    `;

    // Sélectionner les éléments icon et modal
    const icon = document.getElementById("eye");
    const modal = document.getElementById("modaleFile");

    // simulation un clic sur le bouton Newbill
    fireEvent.click(document.querySelector('button[data-testid="icon-eye"]'));

    // Appele la fonction handleClickIconEye
    handleClickIconEye(icon);

    // Vérifie que l'URL de la facture est récupérée
    expect(icon.getAttribute("data-bill-url")).toBe("test-url.jpg");

    // Vérifie que la largeur de l'img est correctement calculée
    const expectedWidth = Math.floor(modal.clientWidth * 0.5);
    expect(modal.img.width).toBe(expectedWidth);

    // Vérifie que le contenu de la modal est mis à jour avec l'img
    expect(screen.getByAltText("Bill").src).toBe("test-url.jpg");

    // Vérifie que la modal est affichée
    expect(modal.style.display).toBe("block");
  });
});

});
});
