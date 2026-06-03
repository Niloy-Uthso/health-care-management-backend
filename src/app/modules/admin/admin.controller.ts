import { Request, Response } from "express";
import { AdminService } from "./admin.server";
import { ca } from "zod/locales";


const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await AdminService.getAllAdmins();
        res.status(200).json(admins);
    } catch (e) {
        console.error("Error fetching admins:", e);
        res.status(500).json({ error: "An error occurred while fetching admins.", e });
    }
}

const getAdminById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const admin = await AdminService.getAdminById(id as string);
        res.status(200).json({
            success: true,
            message: "Admin fetched successfully",
            data: admin
        });
    } catch (e) {
        console.error("Error fetching admin:", e);
        res.status(500).json({ error: "An error occurred while fetching the admin." });
    }
}

const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;  
        const updateData = req.body;
        const result = await AdminService.updateAdmin(id as string, updateData);
        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: result
        });
    } catch (e) {
        console.error("Error updating admin:", e);
        res.status(500).json({ error: "An error occurred while updating the admin." });
    }
        }

const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = req.user;
        
        const result = await AdminService.deleteAdmin(id as string, user);
        res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
            data: result
        });
     }
    catch (e) {
        console.error("Error deleting admin:", e);
        res.status(500).json({ error: "An error occurred while deleting the admin." });
    }
}

export const AdminController = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}


