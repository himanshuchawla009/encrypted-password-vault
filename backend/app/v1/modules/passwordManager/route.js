const { celebrate } = require("celebrate");
const controller = require("./controller");
const validateSchema = require("./schemaValidation");

const route_base = "passwordManager";
const controllerRouter = function (router) {
  router.post(`/${route_base}/registerUser`, celebrate(validateSchema.registerUser), controller.registerUser);
  router.post(`/${route_base}/savePassword`, celebrate(validateSchema.savePassword), controller.savePassword);
  router.get(`/${route_base}/fetchPasswords`, celebrate(validateSchema.fetchPasswords), controller.fetchPasswords);
  router.get(`/${route_base}/fetchUser`, celebrate(validateSchema.fetchUser), controller.fetchUser);
};
module.exports = controllerRouter;
