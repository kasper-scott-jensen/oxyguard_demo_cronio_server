import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { checkUserIn, getUserAttendance, setUserStatusTrue, setUserStatusFalse, checkUserOut, getLatestAttendance } from '../database/sqlite.js'

const router = Router()

router.post(`${process.env.ATTENDANCE_GET}`, [
    body('database').isString()
], async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'invalid format' })
    }
    try {
        const result = await getUserAttendance(req.body.database)
        res.status(200).json({ attendance: result })
    } catch (error) {
        res.status(400).json({ message: 'error fetching attendance' })
        console.log(error)
    }
})

router.post(`${process.env.ATTENDANCE_CHECK_IN}`, [
    body('email').isString(),
    body('database').isString(),
    body('startDate').isString(),
    body('startTime').isString()
], async (req,res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'invalid format' })
    }
    try {
        await setUserStatusTrue(req.body.email)
        await checkUserIn(req.body)
        res.status(200).json({ isCheckedIn: true })
    } catch (error) {
        res.status(400).json({ message: 'error checking in' })
        console.log(error)
    }
})

router.post(`${process.env.ATTENDANCE_CHECK_OUT}`, [
    body('email').isString(),
    body('database').isString(),
    body('endDate').isString(),
    body('endTime').isString()
], async (req,res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'invalid format' })
    }
    try {
        await setUserStatusFalse(req.body.email)
        await checkUserOut(req.body)
        res.status(200).json({ isCheckedIn: false })
    } catch (error) {
        res.status(400).json({ message: 'error checking out' })
        console.log(error)
    }
})

router.post(`${process.env.ATTENDANCE_GET_LATEST}`, [
    body('database').isString()
], async (req,res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'invalid format' })
    }
    try {
        const result = await getLatestAttendance(req.body.database)
        res.status(200).json({ latestAttendance: result[0] })
    } catch (error) {
        res.status(400).json({ message: 'error getting latest attendance' })
        console.log(error)
    }
})

export default router
