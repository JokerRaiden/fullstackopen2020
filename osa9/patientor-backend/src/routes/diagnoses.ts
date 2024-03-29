import express from 'express';
import diagnosisService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_req, res) => {
  const result = diagnosisService.getDiagnoses();
  res.send(result);
});

export default router;