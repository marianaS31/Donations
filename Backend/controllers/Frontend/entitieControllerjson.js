const Entities = require("../../schemas/entities");
const Donations = require("../../schemas/donations");
const multer = require('multer');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
var fs = require('fs');
const path = require('path');

const uploadDir = 'public/Image/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/Image/');
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + path.basename(file.originalname);
    cb(null, filename);
  }
});
const upload = multer({ storage: storage });

const entitieController = {};

entitieController.createEntidade = async function (req, res) {
  upload.single('image')(req, res, async function (err) {
    if (err) {
      console.error('Erro no upload do arquivo:', err);
      return res.status(400).json({ error: 'Erro no upload do arquivo' });
    }

    const { name, description, distrito, email, password } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newEntidade = new Entities({
        name,
        description,
        image: req.file.filename,
        distrito,
        email,
        password: hashedPassword,
      });

      await newEntidade.save();
      res.status(201).json({ message: "Entidade criada com sucesso" });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ errors });
      } else {
        console.error("Erro ao criar entidade:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  });
};

entitieController.getToken = function (req) {
  console.log("Request cookies:", req.cookies);
  const tokenFromCookie = req.cookies["token"];
  console.log("Token from cookie:", tokenFromCookie);
  return tokenFromCookie;
};

entitieController.getProfile = async (req, res) => {
  const token = entitieController.getToken(req);
  console.log("Retrieved token:", token);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "PAW");
    const entitieEmail = decoded.email;
    console.log("Decoded email:", entitieEmail);

    const entitie = await Entities.findOne({ email: entitieEmail });

    if (entitie) {
      return res.status(200).json({
        message: "Entitie found",
        entitie: {
          email: entitie.email,
          name: entitie.name,
          description: entitie.description,
          image: entitie.image,
          district: entitie.distrito,
        },
      });
    } else {
      return res
        .status(404)
        .json({ message: "Entitie not found", email: entitieEmail });
    }
  } catch (error) {
    console.error("Error during token verification or finding entitie:", error);
    return res.status(500).send("Error rendering entitie page.");
  }
};

entitieController.updateEntitie = async (req, res) => {
  console.log("Request cookies:", req.cookies); // Log cookies to verify presence
  const token = entitieController.getToken(req);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  const { name, email, psw, pswrepeat, image, description, distrito } =
    req.body;

  try {
    const decoded = jwt.verify(token, "PAW");
    const entitieEmail = decoded.email;

    const updateFields = {
      name,
      email,
      psw,
      pswrepeat,
      image,
      description,
      distrito,
    };

    const updatedEntitie = await Entities.findOneAndUpdate(
      { email: entitieEmail }, // Query to find the admin by email
      updateFields, // Fields to update
      { new: true } // Options: return the new document
    );

    if (updatedEntitie) {
      res.status(200).json({
        message: "Entitie updated successfully",
        entitie: updatedEntitie,
      });
    } else {
      res.status(404).json({ message: "Entitie not found" });
    }
  } catch (error) {
    console.error("Erro ao atualizar o Entitie:", error);
    res.status(500).json({ message: "Erro ao atualizar o Entitie." });
  }
};
entitieController.getPendingEntities = async (req, res) => {
  try {
      // Consulta as entidades pendentes no banco de dados
      const pendingEntities = await Entities.find({ status: 'Pending' });

      // Verifica se há entidades pendentes
      if (pendingEntities.length > 0) {
          res.status(200).json(pendingEntities); // Retorna as entidades pendentes
      } else {
          res.status(404).json({ message: "Não há entidades pendentes." });
      }
  } catch (error) {
      console.error("Erro ao obter entidades pendentes:", error);
      res.status(500).json({ error: "Erro ao obter entidades pendentes" });
  }
};
entitieController.rejectPendingEntities = async (req, res) => {
  try {
    const { id } = req.params;
    // Consulta a entidade pendente pelo ID
    const entitie = await Entities.findById(id);

    // Verifica se a entidade está pendente
    if (entitie && entitie.status === 'Pending') {
      // Atualiza o status da entidade para 'Rejected'
      await Entities.findByIdAndUpdate(id, { status: 'Rejected' });
      // Remove a entidade do banco de dados
      await Entities.findByIdAndDelete(id);
      res.status(200).json({ message: "Entidade pendente rejeitada e removida com sucesso" });
    } else {
      res.status(404).json({ message: "Entidade pendente não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao rejeitar e remover a entidade pendente:", error);
    res.status(500).json({ error: "Erro ao rejeitar e remover a entidade pendente" });
  }
};


entitieController.acceptPendingEntities = async (req, res) => {
  try {
    const { id } = req.params;
    // Consulta a entidade pendente pelo ID
    const entitie = await Entities.findById(id);

    // Verifica se a entidade está pendente
    if (entitie && entitie.status === 'Pending') {
      // Atualiza o status da entidade para 'Accepted'
      await Entities.findByIdAndUpdate(id, { status: 'Accepted' });
      res.status(200).json({ message: "Entidade aceita com sucesso" });
    } else {
      res.status(404).json({ message: "Entidade pendente não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao aceitar a entidade pendente:", error);
    res.status(500).json({ error: "Erro ao aceitar a entidade pendente" });
  }
};


entitieController.listDonations = async (req, res) => {
  console.log("Request cookies:", req.cookies);
  const token = entitieController.getToken(req);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "PAW");
    const entitieEmail = decoded.email;
    console.log("Decoded email:", entitieEmail);

    const entitie = await Entities.findOne({ email: entitieEmail });

    if (entitie && entitie.donations.length > 0) {
      const donations = entitie.donations.map((donation) => ({
        ...donation.toObject(),
        entityName: entitie.name,
      }));

      return res.status(200).json({
        message: "Donations found",
        donations: donations,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No donations found for this entitie" });
    }
  } catch (error) {
    console.error(
      "Error during token verification or finding donations:",
      error
    );
    return res.status(500).json({ message: "Error retrieving donations." });
  }
};

module.exports = entitieController;
