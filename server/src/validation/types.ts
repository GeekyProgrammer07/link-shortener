import { z } from 'zod'

export const shortenSchema = z.object({
    url: z.string({ message: "Data should be of type string" }).url({ message: "Invalid URL format" })
}, { message: "URL is rquired" }).required(); 