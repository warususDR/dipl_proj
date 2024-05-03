import { Router } from "express";
import contentController from "./contentController.js";

const contentRouter = new Router();

contentRouter.post('/rate', contentController.setRating);
contentRouter.get('/ratings', contentController.getRatings);
contentRouter.get('/rating/:content_id', contentController.getRatingByContent);
contentRouter.post('/act', contentController.updateActions);
contentRouter.get('/actions', contentController.getActionsByUser);


export default contentRouter;