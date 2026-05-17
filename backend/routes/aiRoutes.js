import express from 'express';
import { aiShortlist } from '../controllers/aiController.js';

const router = express.Router();

router.route('/shortlist').post(aiShortlist);

export default router;
