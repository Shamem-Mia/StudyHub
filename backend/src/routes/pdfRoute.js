import express from "express";
import authUser from "../middlewares/userAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

import {
  deletePdfByAdmin,
  deleteUserAndPdfsByAdmin,
  getBook,
  getChowtha,
  getLabReport,
  getNotes,
  getPdfForAmin,
  getPrevQuestion,
  getRandomPdfs,
  getSlides,
  getUserForAdmin,
  likePdf,
  updatePdfByAdmin,
} from "../controllers/pdfController.js";

const pdfRouter = express.Router();

pdfRouter.get("/notes", getNotes);
pdfRouter.get("/slides", getSlides);
pdfRouter.get("/chowtha", getChowtha);
pdfRouter.get("/lab-report", getLabReport);
pdfRouter.get("/book", getBook);
pdfRouter.get("/prev-question", getPrevQuestion);
pdfRouter.get("/random", getRandomPdfs);
pdfRouter.post("/notes/:noteId/like", likePdf);
// for admin
pdfRouter.get("/pdfs", authUser, isAdmin, getPdfForAmin);
pdfRouter.get("/pdfs/:id", authUser, isAdmin, getUserForAdmin);
pdfRouter.put("/pdf/:id", authUser, isAdmin, updatePdfByAdmin);
pdfRouter.delete("/pdf/:id", authUser, isAdmin, deletePdfByAdmin);
pdfRouter.delete("/users/:id", authUser, isAdmin, deleteUserAndPdfsByAdmin);

export default pdfRouter;
