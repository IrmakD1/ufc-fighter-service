// leaving the swagger router out for now because it's dependancies have security vulnerabilities

// const { Router } = require("express");

// let swaggerDocument;
// let swaggerUi;

// if (process.env.NODE_ENV === "development") {
//   /* eslint-disable global-require, import/no-extraneous-dependencies */
//   swaggerUi = require("swagger-ui-express");
//   const YAML = require("yamljs");
//   /* eslint-disable global-require, import/no-extraneous-dependencies */
//   swaggerDocument = YAML.load(`${__dirname}/swagger.yaml`);
// }

// module.exports = () => {
//   const router = Router();
//   if (swaggerUi && swaggerDocument) {
//     router.use("/doc", (req, res) => {
//       res.send(swaggerDocument);
//     });
//     router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//   } else {
//     router.use((req, res, next) => {
//       next();
//     });
//   }
// };
