var entitieController={};
const bcrypt = require("bcrypt");

const Entitie = require("../schemas/entities");
const FormValidator = require("../public/javascript/formValidator");
const formValidator = new FormValidator();
var entitieSearch = require("../public/javascript/entitieSearch.js");

entitieController.createEntitie=async(req,res,next)=>{
    const loggedInUser = req.session.user || {};

    const { name, description,distrito, image,email,psw, pswrepeat} = req.body;
    console.log(name);
    const erros = await formValidator.validateEntitie(
        name,
        description,
        distrito, 
        image,
        email,
        psw,
        pswrepeat
    );
    
    if (erros.length > 0) {
        return res.render('../views/entities/entitiesAdd', { erros,user:{loggedInUser} });
    }

    const saltRounds = 10;
  bcrypt.hash(psw, saltRounds, async (err, hash) => {
    if (err) throw err;
    const entitie = new Entitie({
        name,
        description,
        distrito,
        email,
        image,
        password: hash,
        tipo:"Entidade"
    })
    try{
        await entitie.save();
        const searchResults = await entitieSearch.searchByEmail;
        res.render('../views/entities/entities', {searchResults,user:{loggedInUser}});



    }catch(err){
        console.error("Error saving entitie:", err);
        res.status(500).send({ err: 'Ocorreu um erro ao salvar a entidade na base de dados.' });
    }
});
}
entitieController.deleteEntitie = async (req, res) => {
    const entitieId = req.params.id;
    try {
        await Entitie.findByIdAndDelete(entitieId);
        res.redirect('/entities');
    } catch (error) {
        console.error('Error deleting entities:', error);
        res.status(500).send('Internal server error');
    }
};

entitieController.searchEntitie = async (req, res) => {
    const loggedInUser = req.session.user || {};

    const searchTerm = req.body.searchTerm;
  try {
      const searchResults = await entitieSearch.searchByName(searchTerm);
      res.render('../views/entities/entities', { searchResults,user:{loggedInUser} });
  } catch (error) {
      res.status(500).send('Internal server error');
  }
};

entitieController.renderAddEntitie = async (req, res) => {
    const loggedInUser = req.session.user || {};
    const erros=[];
    res.render('../views/entities/entitiesAdd', { erros,user:{loggedInUser}});
};

entitieController.renderEntitie = async (req, res) => {
    const loggedInUser = req.session.user || {};

    const searchResults= entitieSearch.searchByName;
    res.render('../views/entities/entities',{searchResults,user:{loggedInUser}});
};

entitieController.renderViewEntitie = async (req, res) => {
    const loggedInUser = req.session.user || {};
    const entitieId = req.params.id;
    try {
      const entitie = await Entitie.findById(entitieId); 
      if (entitie) {
          res.render('../views/entities/entitiesView', { entitie,user:{loggedInUser} }); 
      } else {
          res.status(404).send("Entidade não encontrado.");
      }
  } catch (error) {
      console.error("Erro ao renderizar a página de visualização:", error);
      res.status(500).send("Erro ao renderizar a página de visualização.");
  }
    };


entitieController.renderEditEntitie = async (req, res) => {
    const loggedInUser = req.session.user || {};
    const entitieId = req.params.id;

    try {
        const entitie = await Entitie.findById(entitieId);
        if (entitie) {
            res.render('../views/entities/editEntities', { entitie,user:{loggedInUser} });
        } else {
            res.status(404).send("Entidade não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao renderizar a página de edição:", error);
        res.status(500).send("Erro ao renderizar a página de edição.");
    }
};
entitieController.updateEntitie = async (req, res) => {
    const entitieId = req.params.id;
    const { name, description, distrito, image } = req.body;
    try {
        const updateEntitie = await Entitie.findByIdAndUpdate(
            entitieId,
            { name, description, distrito, image },
            { new: true } 
        );

        if (updateEntitie) {
            res.redirect('/entities'); 
        } else {
            res.status(404).send("Entidade não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao atualizar a entidade:", error);
        res.status(500).send("Erro ao atualizar a entidade.");
    }
};
entitieController.getAllEntities = async (req, res) => {
    try {
        const entities = await Entitie.find();
        res.json(entities);
    } catch (error) {
        console.error("Erro ao obter entidades:", error);
        res.status(500).send("Erro ao obter entidades.");
    }
};
entitieController.getEntitieById = async (req, res) => {
    const entitieId = req.params.id;
    try {
        const entitie = await Entitie.findById(entitieId);
        if (entitie) {
            res.json(entitie);
        } else {
            res.status(404).json({ message: "Entidade não encontrada." });
        }
    } catch (error) {
        console.error("Erro ao obter a entidade:", error);
        res.status(500).json({ error: "Erro ao obter a entidade." });
    }
}

  
module.exports=entitieController;