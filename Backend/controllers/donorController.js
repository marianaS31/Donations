var donorController = {}; 
const Donors = require("../schemas/donors");
const FormValidator = require("../public/javascript/formValidator");
const formValidator = new FormValidator();
var donorSearch = require("../public/javascript/donorSearch.js");
const bcrypt = require("bcrypt");

donorController.createDonor = async (req, res, next) => {
  const { name, lname, age, email, psw, pswrepeat } = req.body;
  const loggedInUser = req.session.user || {};

  const erros = await formValidator.validateDonor(
    name,
    lname,
    age,
    email,
    psw,
    pswrepeat
  );

  if (erros.length > 0) {
    return res.render("../views/donors/donorsAdd", {
      erros,
      user: { loggedInUser },
    });
  }

  const saltRounds = 10;
  bcrypt.hash(psw, saltRounds, async (err, hash) => {
    if (err) throw err;
  const donor = new Donors({
    name,
    lname,
    age,
    email,
    password: hash,
    tipo: "Donor",
    points: 0,
  });
  try {
    await donor.save();
    var donorSearch = require("../public/javascript/donorSearch.js");
    const searchResults = donorSearch.searchByEmail;

    res.render("../views/donors/donors", {
      searchResults,
      user: { loggedInUser },
    });
  } catch (err) {
    console.error("Error saving donor:", err);
    res
      .status(500)
      .send({ err: "Ocorreu um erro ao salvar o donor na base de dados." });
  }
});
}

donorController.deleteDonor = async (req, res) => {
  const donorId = req.params.id;
  try {
    await Donors.findByIdAndDelete(donorId);
    res.redirect("/donors");
  } catch (error) {
    console.error("Error deleting donor:", error);
    res.status(500).send("Internal server error");
  }
};

donorController.searchDonor = async (req, res) => {
  const searchTerm = req.body.searchTerm;
  const loggedInUser = req.session.user || {};

  try {
    const searchResults = await donorSearch.searchByEmail(searchTerm);
    res.render("../views/donors/donors", {
      searchResults,
      user: { loggedInUser },
    });
  } catch (error) {
    console.error("Error searching donors by email:", error);
    res.status(500).send("Internal server error");
  }
};

donorController.renderAddDonor = async (req, res) => {
  const loggedInUser = req.session.user || {};

  const erros = [];
  res.render("../views/donors/donorsAdd", { erros, user: { loggedInUser } });
};

donorController.renderDonor = async (req, res) => {
  const loggedInUser = req.session.user || {};

  const searchResults = donorSearch.searchByEmail;
  res.render("../views/donors/donors", {
    searchResults,
    user: { loggedInUser },
  });
};

donorController.renderViewDonor = async (req, res) => {
  const loggedInUser = req.session.user || {};
  const donorId = req.params.id;
  try {
    const donor = await Donors.findById(donorId);
    if (donor) {
      res.render("../views/donors/donorsView", {
        donor,
        user: { loggedInUser },
      });
    } else {
      res.status(404).send("Doador não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao renderizar a página de doadores:", error);
    res.status(500).send("Erro ao renderizar a página de doadores.");
  }
};


donorController.renderEditDoador = async (req, res) => {
  const loggedInUser = req.session.user || {};
  const donorId = req.params.id;

  try {
    const donor = await Donors.findById(donorId);
    if (donor) {
      res.render("../views/donors/editDoador", {
        doador: donor,
        user: { loggedInUser },
      });
    } else {
      res.status(404).send("Doador não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao renderizar a página de edição:", error);
    res.status(500).send("Erro ao renderizar a página de edição.");
  }
};
donorController.updateDoador = async (req, res) => {
  const donorId = req.params.id; 
  const { name, email, points } = req.body;

  try {
    const updatedDoador = await Donors.findByIdAndUpdate(
      donorId,
      { name, email, points }, 
      { new: true } 
    );

    if (updatedDoador) {
      res.redirect("/donors");
    } else {
      res.status(404).send("Doador não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao atualizar o doador:", error);
    res.status(500).send("Erro ao atualizar o doador.");
  }
};

module.exports = donorController;
