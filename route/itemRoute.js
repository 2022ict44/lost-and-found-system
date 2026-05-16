import express from "express";
import { create, fetch, update, deleteItem } from "../controller/itemController.js";

const route = express.Router();

// Route definitions
route.post("/report", create);        // POST: /api/items/report
route.get("/getall", fetch);          // GET: /api/items/getall
route.put("/update/:id", update);     // PUT: /api/items/update/id
route.delete("/delete/:id", deleteItem); // DELETE: /api/items/delete/id

export default route;