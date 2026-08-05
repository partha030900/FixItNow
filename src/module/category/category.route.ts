import { Router } from "express";
import { categoryController } from "./category.controller.js";
import { Role } from "../../../generated/prisma/client.js";
import { auth } from "../../middleware/auth.js";



const router = Router();

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", auth(Role.ADMIN), categoryController.createCategory);
router.patch("/:id", auth(Role.ADMIN), categoryController.updateCategory);
router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;