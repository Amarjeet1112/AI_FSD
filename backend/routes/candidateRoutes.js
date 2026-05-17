import express from 'express';
import { addCandidate, getCandidates, matchCandidates } from '../controllers/candidateController.js';

const router = express.Router();

router.route('/').get(getCandidates).post(addCandidate);
router.route('/match').post(matchCandidates);

export default router;
