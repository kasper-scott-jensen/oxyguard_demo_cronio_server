import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { getUserWishList, saveUserWishList, deleteUserWish } from '../database/sqlite.js'

const router = Router()

router.post(`${process.env.WISHLIST_GET}`, [
    body('database').isString()
], async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'invalid format' })
    }
    try {
        const result = await getUserWishList(req.body.database)
        res.status(200).json({ wishlist: result })
    } catch (error) {
        res.status(400).json({ message: 'error fetching wishlist' })
        console.log(error)
    }
})

router.post(`${process.env.WISHLIST_SAVE}`, [
    body('database').isString(),
    body('wishlist').isArray()
], async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'invalid format' })
    }
    try {
        await saveUserWishList(req.body)
        res.status(200).json({ wishlist: req.body.wishlist })
    } catch (error) {
        console.log(error)
    }
})

router.post(`${process.env.WISHLIST_DELETE}`, [
    body('database').isString(),
    body('wish').isString()
], async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'invalid format' })
    }
    try {
        await deleteUserWish(req.body)
        res.status(200).json({ deleted: req.body.wish })
    } catch (error) {
        console.log(error)
    }
})

export default router
