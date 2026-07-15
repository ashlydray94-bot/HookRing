/**
 * Freemium Middleware & Service
 * Handles export limits, subscription tracking, and tier-based access control
 */

const Database = require('../db');

class FreemiumService {
  /**
   * User subscription tiers
   */
  static TIERS = {
    FREE: 'free',
    ONE_OFF: 'one_off',
    PREMIUM_MONTHLY: 'premium_monthly',
    PREMIUM_ANNUAL: 'premium_annual',
  };

  /**
   * Tier feature limits
   */
  static TIER_LIMITS = {
    free: {
      monthlyExports: 3,
      maxClipLength: 15, // seconds
      maxBitrate: 128, // kbps
      formats: ['mp3'],
      cloudBackup: false,
      adFree: false,
    },
    one_off: {
      monthlyExports: 1,
      maxClipLength: 15,
      maxBitrate: 128,
      formats: ['mp3'],
      cloudBackup: false,
      adFree: false,
    },
    premium_monthly: {
      monthlyExports: Infinity,
      maxClipLength: 30,
      maxBitrate: 320,
      formats: ['mp3', 'wav', 'm4r', 'ogg', 'flac'],
      cloudBackup: true,
      adFree: true,
    },
    premium_annual: {
      monthlyExports: Infinity,
      maxClipLength: 30,
      maxBitrate: 320,
      formats: ['mp3', 'wav', 'm4r', 'ogg', 'flac'],
      cloudBackup: true,
      adFree: true,
    },
  };

  /**
   * Get user's current tier
   * @param {string} userId
   * @returns {Promise<Object>} User tier info
   */
  static async getUserTier(userId) {
    const db = Database.getInstance();
    
    const user = await db.query(
      `SELECT tier, subscription_expires_at, one_off_purchases FROM users WHERE id = ?`,
      [userId]
    );

    if (!user || user.length === 0) {
      throw new Error('User not found');
    }

    const userData = user[0];
    let tier = userData.tier || FreemiumService.TIERS.FREE;

    // Check if subscription has expired
    if (userData.subscription_expires_at) {
      const expiresAt = new Date(userData.subscription_expires_at);
      if (expiresAt < new Date()) {
        // Subscription expired, downgrade to free
        await db.query(
          `UPDATE users SET tier = ?, subscription_expires_at = NULL WHERE id = ?`,
          [FreemiumService.TIERS.FREE, userId]
        );
        tier = FreemiumService.TIERS.FREE;
      }
    }

    return {
      userId,
      tier,
      limits: FreemiumService.TIER_LIMITS[tier],
      expiresAt: userData.subscription_expires_at,
      oneOffPurchases: userData.one_off_purchases || 0,
    };
  }

  /**
   * Get user's export count for current month
   * @param {string} userId
   * @returns {Promise<number>} Exports this month
   */
  static async getMonthlyExportCount(userId) {
    const db = Database.getInstance();
    
    const currentMonth = new Date();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const result = await db.query(
      `SELECT COUNT(*) as count FROM exports 
       WHERE user_id = ? AND created_at >= ? AND created_at <= ?`,
      [userId, firstDayOfMonth, lastDayOfMonth]
    );

    return result[0]?.count || 0;
  }

  /**
   * Check if user can export with given parameters
   * @param {string} userId
   * @param {Object} exportParams - { bitrate, format, clipLength }
   * @returns {Promise<Object>} { allowed: boolean, reason?: string }
   */
  static async canExport(userId, exportParams = {}) {
    const tierInfo = await FreemiumService.getUserTier(userId);
    const limits = tierInfo.limits;
    const currentExports = await FreemiumService.getMonthlyExportCount(userId);

    // Check monthly export limit
    if (currentExports >= limits.monthlyExports && limits.monthlyExports !== Infinity) {
      return {
        allowed: false,
        reason: 'EXPORT_LIMIT_EXCEEDED',
        message: `You have reached your ${limits.monthlyExports} export limit for this month`,
        tier: tierInfo.tier,
      };
    }

    // Check clip length
    if (exportParams.clipLength && exportParams.clipLength > limits.maxClipLength) {
      return {
        allowed: false,
        reason: 'CLIP_TOO_LONG',
        message: `Maximum clip length for your tier is ${limits.maxClipLength} seconds`,
        tier: tierInfo.tier,
        maxClipLength: limits.maxClipLength,
      };
    }

    // Check bitrate
    if (exportParams.bitrate && exportParams.bitrate > limits.maxBitrate) {
      return {
        allowed: false,
        reason: 'BITRATE_NOT_ALLOWED',
        message: `Maximum bitrate for your tier is ${limits.maxBitrate} kbps`,
        tier: tierInfo.tier,
        maxBitrate: limits.maxBitrate,
      };
    }

    // Check format
    if (exportParams.format && !limits.formats.includes(exportParams.format)) {
      return {
        allowed: false,
        reason: 'FORMAT_NOT_ALLOWED',
        message: `Format ${exportParams.format} is not available for your tier`,
        tier: tierInfo.tier,
        availableFormats: limits.formats,
      };
    }

    return {
      allowed: true,
      tier: tierInfo.tier,
      exportsRemaining: limits.monthlyExports === Infinity 
        ? Infinity 
        : limits.monthlyExports - currentExports,
    };
  }

  /**
   * Record an export for a user
   * @param {string} userId
   * @param {Object} exportData - { trackId, bitrate, format, clipLength, etc. }
   * @returns {Promise<Object>} Export record
   */
  static async recordExport(userId, exportData) {
    const db = Database.getInstance();

    const result = await db.query(
      `INSERT INTO exports (user_id, track_id, bitrate, format, clip_length, file_size, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, exportData.trackId, exportData.bitrate, exportData.format, 
       exportData.clipLength, exportData.fileSize]
    );

    return {
      exportId: result.insertId,
      userId,
      ...exportData,
      createdAt: new Date(),
    };
  }

  /**
   * Purchase one-off export
   * @param {string} userId
   * @param {Object} paymentData - { paymentIntentId, amount, currency }
   * @returns {Promise<Object>} Purchase confirmation
   */
  static async purchaseOneOff(userId, paymentData) {
    const db = Database.getInstance();

    // Record purchase
    await db.query(
      `INSERT INTO one_off_purchases (user_id, payment_intent_id, amount, currency, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, paymentData.paymentIntentId, paymentData.amount, paymentData.currency]
    );

    // Increment one-off counter
    await db.query(
      `UPDATE users SET one_off_purchases = one_off_purchases + 1 WHERE id = ?`,
      [userId]
    );

    return {
      success: true,
      userId,
      purchasedAt: new Date(),
      message: 'One-off export purchased successfully',
    };
  }

  /**
   * Upgrade user to premium subscription
   * @param {string} userId
   * @param {Object} subscriptionData - { planType, paymentIntentId, expiresAt }
   * @returns {Promise<Object>} Subscription confirmation
   */
  static async upgradeToSubscription(userId, subscriptionData) {
    const db = Database.getInstance();
    const tier = subscriptionData.planType === 'annual' 
      ? FreemiumService.TIERS.PREMIUM_ANNUAL 
      : FreemiumService.TIERS.PREMIUM_MONTHLY;

    // Update user subscription
    await db.query(
      `UPDATE users SET tier = ?, subscription_expires_at = ?, payment_intent_id = ? WHERE id = ?`,
      [tier, subscriptionData.expiresAt, subscriptionData.paymentIntentId, userId]
    );

    // Record subscription
    await db.query(
      `INSERT INTO subscriptions (user_id, tier, payment_intent_id, expires_at, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, tier, subscriptionData.paymentIntentId, subscriptionData.expiresAt]
    );

    return {
      success: true,
      userId,
      tier,
      expiresAt: subscriptionData.expiresAt,
      message: `Successfully upgraded to ${tier} subscription`,
    };
  }

  /**
   * Cancel subscription
   * @param {string} userId
   * @returns {Promise<Object>} Cancellation confirmation
   */
  static async cancelSubscription(userId) {
    const db = Database.getInstance();

    await db.query(
      `UPDATE users SET tier = ?, subscription_expires_at = NULL WHERE id = ?`,
      [FreemiumService.TIERS.FREE, userId]
    );

    return {
      success: true,
      userId,
      tier: FreemiumService.TIERS.FREE,
      message: 'Subscription cancelled. Your account has been downgraded to free tier.',
    };
  }

  /**
   * Get user's export history
   * @param {string} userId
   * @param {Object} options - { limit, offset }
   * @returns {Promise<Array>} Export history
   */
  static async getExportHistory(userId, options = {}) {
    const db = Database.getInstance();
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    const exports = await db.query(
      `SELECT id, track_id, bitrate, format, clip_length, file_size, created_at 
       FROM exports 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    return exports;
  }
}

/**
 * Express middleware to check freemium permissions
 */
function requireFreemiumCheck(requiredTier = null) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tierInfo = await FreemiumService.getUserTier(userId);
      req.userTier = tierInfo;

      // Check required tier if specified
      if (requiredTier && tierInfo.tier !== requiredTier) {
        return res.status(403).json({
          error: 'TIER_REQUIRED',
          message: `This feature requires ${requiredTier} tier`,
          currentTier: tierInfo.tier,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = {
  FreemiumService,
  requireFreemiumCheck,
};
