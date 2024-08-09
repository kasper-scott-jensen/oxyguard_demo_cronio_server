import express from 'express'
import multer from 'multer'
import cors from 'cors'

import './config/dotenv.config.js'

import { initializeFirebase } from './config/firebase.config.js'
import { wss } from './config/wss.config.js'

import authenticationRouter from './routers/authenticationRouter.js'
import eventRouter from './routers/eventRouter.js'
import attendanceRouter from './routers/attendanceRouter.js'
import statusRouter from './routers/statusRouter.js'
import wishlistRouter from './routers/wishlistRouter.js'

initializeFirebase()

const app = express()

app.use(
    express.json(),
    multer().array(),
    cors({
        origin: process.env.CLIENT
    }),
    authenticationRouter,
    eventRouter,
    attendanceRouter,
    statusRouter,
    wishlistRouter
)

const server = app.listen(process.env.SERVER, () => {
    console.log('server running on port', server.address().port)
    console.log('socket running on port', wss.address().port)
})
