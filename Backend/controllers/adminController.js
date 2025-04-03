const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "PAW";

var adminController = {};
const Admin = require("../schemas/admins");
const FormValidator = require("../public/javascript/formValidator");
const formValidator = new FormValidator();
var adminSearch = require("../public/javascript/adminSearch.js");
const { login } = require("./loginController.js");

adminController.createAdmin = async (req, res, next) => {
  const { name, email, psw, pswrepeat, tipo } = req.body;
  const loggedInUser = req.session.user || {};

  const erros = await formValidator.validateAdmin(
    name,
    email,
    psw,
    pswrepeat,
    tipo
  );

  if (erros.length > 0) {
    return res.render("../views/admin/adminsAdd", { erros, user: loggedInUser });
  }

  const saltRounds = 10;
  bcrypt.hash(psw, saltRounds, async (err, hash) => {
    if (err) throw err;

    const admin = new Admin({
      name,
      email,
      password: hash,
      tipo,
      points: 0,
    });

    try {
      await admin.save();
      const token = jwt.sign({ email: admin.email }, secret, {
        expiresIn: "72h",
      });
      var adminSearch = require("../public/javascript/adminSearch.js");
      const searchResults = adminSearch.searchByEmail;
      res.render("../views/admin/admins", { searchResults, user: loggedInUser });
    } catch (err) {
      console.error("Error saving admin:", err);
      res
        .status(500)
        .send({ err: "Ocorreu um erro ao salvar o admin na base de dados." });
    }
  });
};

adminController.renderViewAdmin = async (req, res) => {
  const loggedInUser = req.session.user || {};
  const adminId = req.params.id;
  try {
    const admin = await Admin.findById(adminId); 
    if (admin) {
        res.render('../views/admin/adminView', { admin,user:{loggedInUser} });
    } else {
        res.status(404).send("Admin não encontrado.");
    }
} catch (error) {
    console.error("Erro ao renderizar a página de visualização:", error);
    res.status(500).send("Erro ao renderizar a página de visualização.");
}
  };

adminController.deleteAdmin = async (req, res) => {
  const adminId = req.params.id;
  try {
    await Admin.findByIdAndDelete(adminId);
    res.redirect("/admins");
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).send("Internal server error");
  }
};

adminController.searchAdmin = async (req, res) => {
  const searchTerm = req.body.searchTerm;
  const loggedInUser = req.session.user || {};

  try {
    const searchResults = await adminSearch.searchByEmail(searchTerm);
    res.render("../views/admin/admins", { searchResults, user: loggedInUser });
  } catch (error) {
    console.error("Error searching admins by email:", error);
    res.status(500).send("Internal server error");
  }
};

adminController.renderAddAdmin = async (req, res) => {
  const loggedInUser = req.session.user || {};

  const erros = [];
  res.render("../views/admin/adminsAdd", { erros, user: loggedInUser });
};

adminController.renderAdmin = async (req, res) => {
  const loggedInUser = req.session.user || {};

  const searchResults = adminSearch.searchByEmail;
  res.render("../views/admin/admins", { searchResults, user: loggedInUser });
};

adminController.renderEditAdmin = async (req, res) => {
  const loggedInUser = req.session.user || {};
  const adminId = req.params.id;

  try {
      const admin = await Admin.findById(adminId); 
      if (admin) {
          res.render('../views/admin/editAdmin', { admin,user: {loggedInUser} });
      } else {
          res.status(404).send("Admin não encontrado.");
      }
  } catch (error) {
      console.error("Erro ao renderizar a página de edição:", error);
      res.status(500).send("Erro ao renderizar a página de edição.");
  }
};
adminController.updateAdmin = async (req, res) => {
  const adminId = req.params.id;
  const { name, email, psw, pswrepeat, tipo } = req.body;

  try {
      const updateAdmin = await Admin.findByIdAndUpdate(
          adminId,
          { name, email, psw, pswrepeat, tipo },
          { new: true } 
      );

      if (updateAdmin) {
          res.redirect('/admins');
      } else {
          res.status(404).send("Admin não encontrado."); 
      }
  } catch (error) {
      console.error("Erro ao atualizar o admin:", error);
      res.status(500).send("Erro ao atualizar o admin.");
  }
};

module.exports = adminController;
