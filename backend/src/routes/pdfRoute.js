import express from "express";
import authUser from "../middlewares/userAuth.js";
import {
  getBook,
  getChowtha,
  getLabReport,
  getNotes,
  getPrevQuestion,
  getRandomPdfs,
  getSlides,
  likePdf,
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

export default pdfRouter;
