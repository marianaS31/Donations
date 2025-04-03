var doacaoController = {};
var donorSearch = require("../public/javascript/donorSearch.js");
const Donations = require("../schemas/donations");
const Donors = require("../schemas/donors");
const Donation = require("../schemas/donations");
const FormValidator = require("../public/javascript/formValidator");
const formValidator = new FormValidator();

var doacaoController = {};

doacaoController.createDoacao = async (req, res) => {
  try {
    const loggedInUser = req.session.user || {};
    const { donorEmail, entity, state } = req.body;
    console.log(state);
    const nameRegex = /^[a-zA-Z]{4,10}/;
    const erros = await formValidator.validateDonation(donorEmail, entity);
    const newDonations = [];
    let pointsFromKg = 0;
    let pointsFromMoney = 0;

    Object.keys(req.body).forEach((key) => {
      if (key.startsWith("donationType")) {
        const donationType = req.body[key];
        const donationId = key.replace("donationType", "");
        const donation = {};

        if (donationType === "money") {
          donation.type = donationType;
          donation.quantity = req.body[`moneyQuantity${donationId}`];
          if (donation.quantity <= 0) {
            erros.push("Quantidade tem de ser maior que 0");
          }
          pointsFromMoney += donation.quantity * 2;
          pointsFromMoneyDonation = donation.quantity * 2;
          donation.points = pointsFromMoneyDonation;
          donation.state = state;
        } else if (donationType === "cloth") {
          donation.type = donationType;
          donation.kg = req.body[`clothWeight${donationId}`];
          donation.color = req.body[`clothColor${donationId}`];
          donation.clothType = req.body[`clothType${donationId}`];
          if (donation.kg <= 0) {
            erros.push("Peso tem de ser maior que 0");
          }
          if (!donation.color.match(nameRegex)) {
            erros.push("Tem de inserir uma cor válida");
          }
          if (!donation.clothType.match(nameRegex)) {
            erros.push("Tem de inserir um tipo válido");
          }
          pointsFromKg += donation.kg * 5;
          pointsFromKgDonation = donation.kg * 5;
          donation.points = pointsFromKgDonation;
          donation.state = state;
        }
        newDonations.push(donation);
        console.log(
          "Pontos kg " + pointsFromKg + " pontos do dinheiro " + pointsFromMoney
        );
      }
    });

    if (newDonations.length == 0) {
      erros.push("Tem de ter pelo menos uma doação");
    }
    if (erros.length > 0) {
      return res.render("../views/doacao/doacaoAdd", {
        erros,
        user: loggedInUser,
      });
    }

    const existingDonation = await Donation.findOne({ donorEmail, entity });

    if (existingDonation) {
      // Update existing donation
      existingDonation.donations.push(...newDonations);
      await existingDonation.save();
    } else {
      // Create new donation
      const donation = new Donation({
        donorEmail,
        entity,
        state: state,
        donations: newDonations,
      });
      await donation.save();
    }

    const donor = await Donors.findOne({ email: donorEmail });
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    await Donors.findByIdAndUpdate(
      donor._id,
      { $inc: { points: pointsFromKg + pointsFromMoney } },
      { new: true }
    );

    res.status(201);
    res.redirect("/doacao");
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

doacaoController.search = async (req, res) => {
  const searchTerm = req.body.searchTerm;
  const loggedInUser = req.session.user || {};

  try {
    const searchResults = await donorSearch.searchByEmail(searchTerm);
    res.render("../views/doacao/doacao", {
      searchResults,
      user: { loggedInUser },
    });
  } catch (error) {
    console.error("Error searching donors by email:", error);
    res.status(500).send("Internal server error");
  }
};

doacaoController.renderDoacao = async (req, res) => {
  const loggedInUser = req.session.user || {};
  const searchResults = donorSearch.searchByEmail;
  res.render("../views/doacao/doacao", {
    searchResults,
    user: { loggedInUser },
  });
};

doacaoController.listDoacoes = async (req, res) => {
  try {
    console.log("Iniciando listagem de doações...");

    const loggedInUser = req.session.user || {};
    console.log("Usuário logado:", loggedInUser);

    // Buscar todas as doações, ordenadas por data decrescente
    const doacoes = await Donations.find();
    console.log("Doações encontradas:", doacoes);

    // Renderizar a página com a lista de doações
    res.render("../views/doacao/listDoacoes", {
      doacoes,
      user: { loggedInUser },
    });
  } catch (error) {
    console.error("Erro ao listar doações:", error);
    res.status(500).send("Erro ao listar doações.");
  }
};

doacaoController.renderCreateDoacao = (req, res) => {
  const loggedInUser = req.session.user || {};
  const erros = [];
  res.render("../views/doacao/doacaoAdd", { erros, user: { loggedInUser } });
};

doacaoController.deleteDoacao = async (req, res) => {
  try {
    const donationId = req.params.id;

    await Donation.findByIdAndDelete(donationId);

    res.redirect("/doacao/list");
  } catch (error) {
    console.error("Erro ao apagar doação:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao apagar doação" });
  }
};

doacaoController.updateState = async (req, res) => {
  try {
    const donationId = req.params.id;
    const donationIndex = req.params.index;
    const newState = req.body.state;

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    // Update the state of the specific donation item
    donation.donations[donationIndex].state = newState;
    await donation.save();

    res.redirect("/doacao/list");
  } catch (error) {
    console.error("Error updating donation state:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = doacaoController;
