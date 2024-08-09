import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { getUserEvents } from '../database/sqlite.js'

const router = Router()

router.post(`${process.env.EVENT_GET}`, [
    body('database').isString()
], async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'invalid format' })
    }
    try {
        const result = await getUserEvents(req.body.database)
        res.status(200).json({ events: result })
    } catch (error) {
        res.status(400).json({ message: 'error fetching events' })
        console.log(error)
    }
})

export default router
