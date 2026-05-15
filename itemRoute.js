import express from "express";
import { create, fetch, update, deleteItem } from "../controller/itemController.js";

const route = express.Router();

route.post("/report", create);        
route.get("/getall", fetch);          
route.put("/update/:id", update);     
route.delete("/delete/:id", deleteItem); 

export default route;