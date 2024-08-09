import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { getUserStatus } from '../database/sqlite.js'

const router = Router()

router.post(`${process.env.STATUS_GET}`, [
    body('email').isString()
], async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'invalid format' })
    }
    try {
        const result = await getUserStatus(req.body.email)
        res.status(200).json({ isCheckedIn: result[0].is_checked_in })
    } catch (error) {
        res.status(400).json({ message: 'error fetching status' })
        console.log(error)
    }
})

export default router
