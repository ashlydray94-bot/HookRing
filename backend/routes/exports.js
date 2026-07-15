/**
 * Export Routes
 * Handles ringtone export requests with freemium enforcement
 */

const express = require('express');
const router = express.Router();
const { FreemiumService, requireFreemiumCheck } = require('../middleware/freemium');
const { AudioService } = require('../services/audio');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/exports/status
 * Get current export status and limits for authenticated user
 */
router.get('/status', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const tierInfo = await FreemiumService.getUserTier(userId);
    const monthlyCount = await FreemiumService.getMonthlyExportCount(userId);
    const limits = tierInfo.limits;

    res.json({
      tier: tierInfo.tier,
      expiresAt: tierInfo.expiresAt,
      monthlyExports: {
        used: monthlyCount,
        limit: limits.monthlyExports === Infinity ? null : limits.monthlyExports,
        remaining: limits.monthlyExports === Infinity 
          ? null 
          : Math.max(0, limits.monthlyExports - monthlyCount),
      },
      features: {
        maxClipLength: limits.maxClipLength,
        maxBitrate: limits.maxBitrate,
        supportedFormats: limits.formats,
        cloudBackup: limits.cloudBackup,
        adFree: limits.adFree,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/exports
 * Create a new ringtone export
 * Body: { trackId, startTime, endTime, format, bitrate }
 */
router.post('/', authenticate, requireFreemiumCheck(), async (req, res) => {
  try {
    const userId = req.user.id;
    const { trackId, startTime, endTime, format = 'mp3', bitrate = 128 } = req.body;

    // Validate input
    if (!trackId || startTime === undefined || endTime === undefined) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'trackId, startTime, and endTime are required',
      });
    }

    const clipLength = endTime - startTime;

    // Check freemium limits
    const canExport = await FreemiumService.canExport(userId, {
      clipLength,
      format,
      bitrate,
    });

    if (!canExport.allowed) {
      return res.status(403).json(canExport);
    }

    // Process audio export
    console.log(`Processing export for user ${userId}: ${trackId} (${clipLength}s)`);
    
    const exportResult = await AudioService.exportRingtone({
      trackId,
      startTime,
      endTime,
      format,
      bitrate,
    });

    // Record export in database
    const exportRecord = await FreemiumService.recordExport(userId, {
      trackId,
      bitrate,
      format,
      clipLength,
      fileSize: exportResult.fileSize,
    });

    // Return download link
    res.json({
      success: true,
      exportId: exportRecord.exportId,
      trackId,
      format,
      bitrate,
      clipLength,
      fileSize: exportResult.fileSize,
      downloadUrl: `/api/exports/${exportRecord.exportId}/download`,
      exportsRemaining: canExport.exportsRemaining,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24-hour expiry
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/exports/:exportId/download
 * Download a processed ringtone
 */
router.get('/:exportId/download', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { exportId } = req.params;

    // Verify user owns this export
    const export_record = await FreemiumService.getExportHistory(userId, { limit: 1, offset: 0 });
    const owned = export_record.some(e => e.id === exportId);

    if (!owned) {
      return res.status(403).json({ error: 'UNAUTHORIZED' });
    }

    // Download file (implementation depends on storage)
    const filePath = await AudioService.getExportFile(exportId);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/exports/history
 * Get user's export history
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const history = await FreemiumService.getExportHistory(userId, {
      limit: Math.min(limit, 100),
      offset,
    });

    res.json({
      exports: history,
      limit: Math.min(limit, 100),
      offset,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
