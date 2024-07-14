import express from 'express';

const router = express.Router();
import { getUserFriendsSuggest } from '../controller/randController.js';

router.get('/friends-suggest',getUserFriendsSuggest);

export default router;