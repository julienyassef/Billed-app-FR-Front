import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  handleChangeFile = e => {
    e.preventDefault()

     // Obtenez une référence vers l'élément bouton et l'élément de message d'erreur
    const chooseFileButton = document.getElementById('resetButtonErrorMessage');
    const errorMessageElement = document.getElementById('error-message');

    // Ajoutez un gestionnaire d'événements au clic sur le bouton
    chooseFileButton.addEventListener('click', () => {
      // Réinitialise le message d'erreur à une chaîne vide
      errorMessageElement.textContent = '';
    });

    const fileInput = document.querySelector(`input[data-testid="file"]`);
    const file = fileInput.files[0];

  
    // Liste des extensions de fichiers autorisées
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    // Obtient le nom du fichier et convertit toutes les lettres en minuscules
    const fileName = file.name.toLowerCase();
    console.log(fileName)

    // Divise le nom du fichier en un tableau en utilisant le point (.) comme séparateur,
    // puis récupère la dernière partie du tableau, qui représente l'extension du fichier
    const fileExtension = fileName.split('.').pop();


    if (!allowedExtensions.includes(fileExtension)) {
      // Affiche le message d'erreur sur la page web
      const errorMessageElement = document.getElementById('error-message');
      errorMessageElement.textContent = 'Veuillez sélectionner un fichier avec une extension jpg, jpeg, ou png.';
      
      // Réinitialise le champ de fichier (facultatif)
      fileInput.value = '';
      return;
    }


    const formData = new FormData()
    const email = JSON.parse(localStorage.getItem("user")).email
    formData.append('file', file)
    formData.append('email', email)

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then(({fileUrl, key}) => {
        console.log(fileUrl)
        this.billId = key
        this.fileUrl = fileUrl
        this.fileName = fileName
      }).catch(error => console.error(error))
  }
  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}