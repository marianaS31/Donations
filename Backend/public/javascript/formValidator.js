class formValidator {
  async validateDonor(name, lname, age, email, psw, pswrepeat) {
    const Donors = require("../../schemas/donors"); //Importa o modelo donor
    const errors = [];
    const checkEmail = await Donors.findOne({ email });
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const nameRegex = /^[a-zA-Z]{4,10}/;

    if (checkEmail) {
      errors.push("Email já em uso");
    }

    if (!name.match(nameRegex)) {
      errors.push("Tem de ter um nome válido");
    }
    if (!lname.match(nameRegex)) {
      errors.push("Tem de ter um sobrenome válido");
    }

    if (age > 99 || age < 18) {
      errors.push("Tem de ter um adulto");
    }

    if (!email.match(emailRegex)) {
      errors.push("Tem de ter um email válido");
    }

    if (psw.length < 3) {
      errors.push("Tem de ter uma password com 3 digitos");
    }

    if (psw != pswrepeat) {
      errors.push("Passwords têm de ser iguais");
    }

    return errors;
  }
  async validateAdmin(name, email, psw, pswrepeat, tipo) {
    const Admins = require("../../schemas/admins"); //Importa o modelo admin
    const errors = [];
    const checkEmail = await Admins.findOne({ email });
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const nameRegex = /^[a-zA-Z]{4,10}/;
    if (!name.match(nameRegex)) {
      errors.push("Tem de ter um nome válido");
    }
    if (!email.match(emailRegex)) {
      errors.push("Tem de ter um email válido");
    }

    if (checkEmail) {
      errors.push("Email já em uso");
    }
    if (psw !== pswrepeat) {
      errors.push("As senhas não coincidem");
    }

    if (psw.length < 3) {
      errors.push("Tem de ter uma password com 3 digitos");
    }

    if (!tipo || (tipo !== "Admin" && tipo !== "Funcionario")) {
      errors.push("Tipo inválido");
    }
    return errors;
  }

  async validateEntitie(name, description, email, psw, image) {
    const Entities = require("../../schemas/entities");
    const errors = [];
    const checkEmail = await Entities.findOne({ email });
    const checkName = await Entities.findOne({ name });
    //const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const nameRegex = /^[a-zA-Z ]+$/;

    if (!name.match(nameRegex)) {
      errors.push("Nome inválido");
    }
    if (checkName) {
      errors.push("Nome já em uso");
    }
    if (!description.match(nameRegex)) {
      errors.push("Descrição inválida");
    }
    /*if (!email.match(emailRegex)) {
      errors.push("Email inválido");
    }*/
    if (checkEmail) {
      errors.push("Email já em uso");
    }
    if (psw.length < 3) {
      errors.push("Senha deve ter pelo menos 3 caracteres");
    }
    if (!image) {
      errors.push("Imagem é obrigatória");
    }
    return errors;
  }

  async validateDonation(donor, entitie) {
    console.log("Donor:", donor);

    const Entities = require("../../schemas/entities");
    const Donors = require("../../schemas/donors");

    const errors = [];

    try {
      const checkDonor = await Donors.findOne({ email: donor });
      if (!checkDonor) {
        errors.push("Não existe um Doador com esse email");
      }
      const checkEntitie = await Entities.findOne({ name: entitie });
      if (!checkEntitie) {
        errors.push("Não existe uma entidade com esse nome");
      }
      return errors;
    } catch (error) {
      console.error("Error in validateDonation:", error);
      throw error;
    }
  }
}

module.exports = formValidator;
