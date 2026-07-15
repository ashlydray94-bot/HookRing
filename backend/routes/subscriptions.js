/**
 * Subscription Routes
 * Handles subscription management, upgrades, and one-off purchases
 */

const express = require('express');
const router = express.Router();
const { FreemiumService } = require('../middleware/freemium');
const { PaymentService } = require('../services/payment');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/subscriptions/plans
 * Get available subscription plans (public)
 */
router.get('/plans', (req, res) => {
  res.json({
    plans: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'usd',
        billing: 'free',
        features: {
          monthlyExports: 3,
          maxClipLength: 15,
          maxBitrate: 128,
          formats: ['mp3'],
          cloudBackup: false,
          adFree: false,
        },
      },
      {
        id: 'one_off',
        name: 'One-Off Export',
        price: 0.99,
        currency: 'usd',
        billing: 'one-time',
        description: 'Purchase a single additional export',
        features: {
          monthlyExports: 1,
          maxClipLength: 15,
          maxBitrate: 128,
          formats: ['mp3'],
          cloudBackup: false,
          adFree: false,
        },
      },
      {
        id: 'premium_monthly',
        name: 'Premium Monthly',
        price: 2.99,
        currency: 'usd',
        billing: 'monthly',
        description: 'Unlimited exports and premium features',
        features: {
          monthlyExports: Infinity,
          maxClipLength: 30,
          maxBitrate: 320,
          formats: ['mp3', 'wav', 'm4r', 'ogg', 'flac'],
          cloudBackup: true,
          adFree: true,
        },
      },
      {
        id: 'premium_annual',
        name: 'Premium Annual',
        price: 19.99,
        currency: 'usd',
        billing: 'annual',
        discount: 0.33,
        description: 'Unlimited exports and premium features (33% savings)',
        features: {
          monthlyExports: Infinity,
          maxClipLength: 30,
          maxBitrate: 320,
          formats: ['mp3', 'wav', 'm4r', 'ogg', 'flac'],
          cloudBackup: true,
          adFree: true,
        },
      },
    ],
  });
});

/**
 * GET /api/subscriptions/current
 * Get current subscription status for authenticated user
 */
router.get('/current', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const tierInfo = await FreemiumService.getUserTier(userId);

    res.json({
      tier: tierInfo.tier,
      expiresAt: tierInfo.expiresAt,
      features: tierInfo.limits,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/subscriptions/upgrade
 * Upgrade to premium subscription
 * Body: { planId, paymentMethodId }
 */
router.post('/upgrade', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId, paymentMethodId } = req.body;

    if (!planId || !paymentMethodId) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'planId and paymentMethodId are required',
      });
    }

    // Validate plan
    if (!['premium_monthly', 'premium_annual'].includes(planId)) {
      return res.status(400).json({
        error: 'INVALID_PLAN',
        message: 'Invalid subscription plan',
      });
    }

    // Process payment
    const paymentResult = await PaymentService.createSubscription({
      userId,
      planId,
      paymentMethodId,
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        error: 'PAYMENT_FAILED',
        message: paymentResult.message,
      });
    }

    // Upgrade user
    const planType = planId === 'premium_annual' ? 'annual' : 'monthly';
    const subscriptionResult = await FreemiumService.upgradeToSubscription(userId, {
      planType,
      paymentIntentId: paymentResult.paymentIntentId,
      expiresAt: paymentResult.expiresAt,
    });

    res.json({
      success: true,
      subscription: subscriptionResult,
      paymentIntentId: paymentResult.paymentIntentId,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/subscriptions/one-off
 * Purchase one-off export
 * Body: { paymentMethodId }
 */
router.post('/one-off', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethodId } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'paymentMethodId is required',
      });
    }

    // Process payment
    const paymentResult = await PaymentService.createOneOffPurchase({
      userId,
      amount: 0.99,
      currency: 'usd',
      paymentMethodId,
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        error: 'PAYMENT_FAILED',
        message: paymentResult.message,
      });
    }

    // Record purchase
    const purchaseResult = await FreemiumService.purchaseOneOff(userId, {
      paymentIntentId: paymentResult.paymentIntentId,
      amount: 0.99,
      currency: 'usd',
    });

    res.json({
      success: true,
      message: 'One-off export purchased successfully',
      paymentIntentId: paymentResult.paymentIntentId,
    });
  } catch (error) {
    console.error('One-off purchase error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/subscriptions/cancel
 * Cancel current subscription
 */
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await FreemiumService.cancelSubscription(userId);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
