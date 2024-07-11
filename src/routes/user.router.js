const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");

const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);
router.post("/logout", userController.logout.bind(userController));
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userController.admin
);
router.post("/requestPasswordReset", userController.requestPasswordReset); // Nueva ruta
router.post("/reset-password", userController.resetPassword);
// Rutas Admin
router.get("/requestAdmin", userController.renderFormAdmin);
router.post("/requestAdmin", userController.requestAdmin);

//-------------RUTAS DE LOS PUNTOS PARA EL TP FINAL
//Creacion de Get
router.get("/", userController.getUsuarios);
//en delete poner middleware de passport para poderrecuperar usaurio por el middleware de passport

router.delete("/delete", userController.deleteUserinactividad);

//aqui va  ahacer para las vistas del admin que cambia el rol y elimina usuarios
router.get("/gestionUser", userController.gestionUsuario);
router.put("/gestionUser", userController.changeRolUser);
//-------------AQUI TERMINA EL BLOQUE DE LOS PUNTOS PARA EL TOP FINAL

//Cuarta integradora:

//Modificamos el usuario para que sea premium:
router.put("/premium/:uid", userController.cambiarRolPremium);

const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
//Vamos a crear un middleware para Multer y lo vamos a importar:
const upload = require("../middleware/multer.js");

router.post(
  "/:uid/documents",
  upload.fields([
    { name: "document" },
    { name: "products" },
    { name: "profile" },
  ]),
  async (req, res) => {
    const { uid } = req.params;
    const uploadedDocuments = req.files;

    try {
      const user = await userRepository.findById(uid);

      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      //Ahora vamos a verificar si se suben los documentos y se actualiza el usuario:

      if (uploadedDocuments) {
        if (uploadedDocuments.document) {
          user.documents = user.documents.concat(
            uploadedDocuments.document.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }

        if (uploadedDocuments.products) {
          user.documents = user.documents.concat(
            uploadedDocuments.products.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }

        if (uploadedDocuments.profile) {
          user.documents = user.documents.concat(
            uploadedDocuments.profile.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }
      }

      //Guardamos los cambios en la base de datos:

      await user.save();

      res.status(200).send("Documentos cargados exitosamente");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send(
          "Error interno del servidor, los mosquitos seran cada vez mas grandes"
        );
    }
  }
);

module.exports = router;
