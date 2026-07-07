import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { rateLimitByUser } from "../../middlewares/rateLimit.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { communityController } from "./community.controller";

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(communityController.listAll));
router.get('/:communityId', asyncHandler(communityController.getOne));
router.post('/:communityId/join', asyncHandler(communityController.joinCommunity));
router.delete('/:communityId/leave', asyncHandler(communityController.leaveCommunity));

router.get(
    '/:communityId/messages',
    rateLimitByUser({ windowSeconds: 60, maxRequests: 60, keyPrefix: 'rl:community:messages' }),
    asyncHandler(communityController.getMessages)
);

export default router;