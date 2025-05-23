import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

export const redirectRouter = express.Router();
const prisma = new PrismaClient();

redirectRouter.get("/:param", async (req: Request, res: Response): Promise<any> => {
  const { param } = req.params;

  const shortLink = await prisma.uRLs.findUnique({
    where: {
      shortCode: param,
    },
  });

  if (!shortLink) {
    return res.status(404).json({
      message: "Link not found",
    });
  }
  
  const temp: number = shortLink.accessCount + 1
  await prisma.uRLs.update({
    where: {
      shortCode: param
    },
    data: {
      accessCount: temp
    }
  })

  const realLink = shortLink.url;

  return res.redirect(realLink);
});
