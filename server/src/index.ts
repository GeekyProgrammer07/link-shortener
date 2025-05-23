import express, { Request, Response, NextFunction } from 'express'
import { mainRouter } from './routes/mainRouter'
import { error } from 'console'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())
app.use('/shorten', mainRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction): any => {
    console.error(err.stack)
    return res.status(500).json({
        message: "Internal Server Error"
    })
})

app.listen(3000, () => {
    console.log("Listening on 3000")
})