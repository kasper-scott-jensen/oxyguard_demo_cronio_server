import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { verifySessionToken } from '../database/firebase.js'

const router = Router()

router.post(`${process.env.AUTH_VERIFY_TOKEN}`, [
    body('sessionToken').isString()
], async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'invalid format' })
    }
    try {
        const decodedToken = await verifySessionToken(req.body.sessionToken)
        res.status(200).json({ verified: true, token: decodedToken });
    } catch (error) {
        res.status(400).json({ message: 'error verifying token' });
        console.log(error)
    }
})

export default router
