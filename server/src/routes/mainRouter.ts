import express, { Request, Response } from 'express'
import { shortenSchema } from '../validation/types'
import { PrismaClient } from '@prisma/client';

export const mainRouter = express.Router()

const currentDate = new Date();
const prisma = new PrismaClient();

mainRouter.post('/', async (req: Request, res: Response): Promise<any> => {
    const validatedUrl = await shortenSchema.safeParse(req.body);
    if (!validatedUrl.success) {
        return res.status(400).json({
            error: validatedUrl.error.flatten()
        })
    }

    const isAlreadyPresent = await prisma.uRLs.findUnique({
        where: {
            url: validatedUrl.data.url
        }
    })

    if (isAlreadyPresent) {
        return res.status(201).json({
            id: isAlreadyPresent.id,
            url: isAlreadyPresent.url,
            shortCode: isAlreadyPresent.shortCode,
            createdAt: isAlreadyPresent.createdAt,
            updatedAt: isAlreadyPresent.updatedAt
        })
    }

    const rand = require('random-seed').create();
    const bases = require('bases')

    const minValue = bases.fromBase36('100000');
    const maxValue = bases.fromBase36('zzzzzz');

    const shortCode: string = bases.toBase36(rand.intBetween(minValue, maxValue));

    const response = await prisma.uRLs.create({
        data: {
            url: validatedUrl.data.url,
            shortCode,
            createdAt: currentDate,
            updatedAt: currentDate,
            accessCount: 0
        }
    })

    res.status(201).json({
        id: response.id,
        url: response.url,
        shortCode,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
    })
})

mainRouter.get('/:param', async (req: Request, res: Response): Promise<any> => {
    const { param } = req.params;
    const response = await prisma.uRLs.findUnique({
        where: {
            shortCode: param
        }
    })
    if (!response) {
        return res.status(404).json({
            message: "404 not found"
        })
    }
    res.status(200).json({
        id: response.id,
        url: response.url,
        shortCode: response.shortCode,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
    })
})

mainRouter.put('/:param', async (req: Request, res: Response): Promise<any> => {
    const validateUrl = await shortenSchema.safeParse(req.body);
    if (!validateUrl.success) {
        return res.status(400).json({
            error: validateUrl.error.flatten()
        })
    }
    const foundUrl = await prisma.uRLs.findUnique({
        where: {
            url: validateUrl.data.url
        }
    })
    if (!foundUrl) {
        return res.status(404).json({
            message: "URL not found"
        })
    }
    const { param } = req.params;
    const foundShortCode = await prisma.uRLs.findUnique({
        where: {
            shortCode: param
        }
    })
    if (foundShortCode) {
        return res.status(404).json({
            message: "Duplicate Shortcodes are not allowed"
        })
    }
    const updatedShortCode = await prisma.uRLs.update({
        where: {
            url: validateUrl.data.url
        },
        data: {
            shortCode: param,
            updatedAt: currentDate
        }
    })

    res.status(200).json({
        id: updatedShortCode.id,
        url: updatedShortCode.url,
        shortCode: updatedShortCode.shortCode,
        createdAt: updatedShortCode.createdAt,
        updatedAt: updatedShortCode.updatedAt
    })
})

mainRouter.delete('/:param', async (req: Request, res: Response): Promise<any> => {
    const { param } = req.params;
    const foundShortCode = await prisma.uRLs.findUnique({
        where: {
            shortCode: param
        }
    })
    if (!foundShortCode) {
        return res.status(404).json({
            message: "Not Found"
        })
    }
    const deleteUrl = await prisma.uRLs.delete({
        where: {
            shortCode: param
        }
    })
    console.log(deleteUrl);

    res.status(204).json({
        message: "Short URL deleted"
    })
})

mainRouter.get('/:param/stats', async (req: Request, res: Response): Promise<any> => {
    const { param } = req.params;
    const foundShortCode = await prisma.uRLs.findUnique({
        where: {
            shortCode: param
        }
    })
    if (!foundShortCode) {
        return res.status(404).json({
            message: "Not Found"
        })
    }
    res.status(200).json({
        id: foundShortCode.id,
        url: foundShortCode.url,
        shortCode: foundShortCode.shortCode,
        createdAt: foundShortCode.createdAt,
        updatedAt: foundShortCode.updatedAt,
        accessCount: foundShortCode.accessCount
    })
})