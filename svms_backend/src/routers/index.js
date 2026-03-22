import express from 'express';

import docrouter from '../documentation/index.doc.js';
import userRouter from './userRouter.js';
import authRouter from './authRouter.js';
import Post from './PostRouter.js';
import CategoriesRouter from './categoriesRouter.js';
import notification from './notificationRouter.js';
import Address from './AddressRouter.js';

const router = express.Router();

router.use('/docs', docrouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/post', Post);
router.use('/categories', CategoriesRouter);
router.use('/address', Address);
router.use('/notification', notification);

// ── New Routers with robust error handling ────────────────
// Note: In ESM, we use dynamic import() for conditional loading
const loadOptionalRouters = async () => {
  try {
    const familyMemberModule = await import('./familyMemberRouter.js');
    const familyRouter = familyMemberModule.default || familyMemberModule;
    router.use('/family-members', familyRouter);
    console.log('✅ familyMemberRouter mounted at /api/v1/family-members');
  } catch (err) {
    console.error('❌ Failed to load familyMemberRouter:', err.message);
  }

  try {
    const reportingModule = await import('./reportingRouter.js');
    const reportsRouter = reportingModule.default || reportingModule;
    router.use('/reports', reportsRouter);
    console.log('✅ reportingRouter mounted at /api/v1/reports');
  } catch (err) {
    console.error('❌ Failed to load reportingRouter:', err.message);
  }
};

loadOptionalRouters();

// Diagnostic: hit GET /api/v1/test-routes to see all mounted routes
router.get('/test-routes', (req, res) => {
  const routes = [];
  router.stack.forEach((layer) => {
    if (layer.route) {
      routes.push({ path: layer.route.path, methods: layer.route.methods });
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      layer.handle.stack.forEach((r) => {
        if (r.route) {
          routes.push({ path: r.route.path, methods: r.route.methods });
        }
      });
    }
  });
  res.json({ success: true, registeredRoutes: routes.length, routes });
});

export default router;
