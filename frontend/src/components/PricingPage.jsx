import React, { useState, useEffect } from 'react';
import './PricingPage.css';

/**
 * PricingPage Component
 * Displays HookRing pricing tiers with upgrade/purchase options
 */
const PricingPage = () => {
  const [currentTier, setCurrentTier] = useState('free');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  useEffect(() => {
    // Fetch current user tier on mount
    fetchUserTier();
  }, []);

  const fetchUserTier = async () => {
    try {
      const response = await fetch('/api/subscriptions/current', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await response.json();
      setCurrentTier(data.tier);
    } catch (error) {
      console.error('Error fetching tier:', error);
    }
  };

  const handleUpgrade = async (planId) => {
    setIsLoading(true);
    try {
      // In production, integrate with Stripe/RevenueCat
      const response = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ planId, paymentMethodId: 'pm_placeholder' })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentTier(planId);
        setExportStatus({ type: 'success', message: `Upgraded to ${planId}!` });
      } else {
        const error = await response.json();
        setExportStatus({ type: 'error', message: error.message });
      }
    } catch (error) {
      setExportStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOneOff = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/one-off', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ paymentMethodId: 'pm_placeholder' })
      });

      if (response.ok) {
        setExportStatus({ type: 'success', message: 'One-off export purchased! You have 1 additional export.' });
      } else {
        const error = await response.json();
        setExportStatus({ type: 'error', message: error.message });
      }
    } catch (error) {
      setExportStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      billing: 'Forever free',
      description: 'Perfect for trying HookRing',
      features: [
        '3 ringtones/month',
        '15-second max clips',
        '128 kbps bitrate',
        'MP3 only',
        'Standard support'
      ],
      cta: currentTier === 'free' ? 'Current Plan' : 'Downgrade',
      highlighted: false
    },
    {
      id: 'premium_monthly',
      name: 'Premium',
      price: 2.99,
      billing: 'per month',
      description: 'Best for regular creators',
      features: [
        'Unlimited ringtones',
        '30-second max clips',
        'Up to 320 kbps bitrate',
        'MP3, WAV, M4R, OGG',
        'Priority support',
        '30-day cloud backup'
      ],
      cta: currentTier === 'premium_monthly' ? 'Current Plan' : 'Upgrade Now',
      highlighted: false
    },
    {
      id: 'premium_annual',
      name: 'Premium Annual',
      price: 19.99,
      billing: 'per year',
      savings: '33% off',
      description: 'Best value for power users',
      features: [
        'Unlimited ringtones',
        '30-second max clips',
        'Up to 320 kbps bitrate',
        'All audio formats',
        'Priority support',
        '30-day cloud backup'
      ],
      cta: currentTier === 'premium_annual' ? 'Current Plan' : 'Upgrade Now',
      highlighted: true
    }
  ];

  return (
    <div className="pricing-page">
      {/* Header */}
      <div className="pricing-header">
        <h1>Simple, Transparent Pricing</h1>
        <p>Choose the plan that works for you</p>
      </div>

      {/* Status Message */}
      {exportStatus && (
        <div className={`status-message ${exportStatus.type}`}>
          {exportStatus.message}
          <button onClick={() => setExportStatus(null)}>×</button>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`pricing-card ${plan.highlighted ? 'highlighted' : ''} ${currentTier === plan.id ? 'active' : ''}`}
          >
            {plan.savings && <div className="savings-badge">{plan.savings}</div>}

            <div className="pricing-card-header">
              <h2>{plan.name}</h2>
              <div className="price">
                <span className="amount">${plan.price}</span>
                <span className="billing">{plan.billing}</span>
              </div>
              <p className="description">{plan.description}</p>
            </div>

            <ul className="features-list">
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <span className="checkmark">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`cta-button ${currentTier === plan.id ? 'disabled' : ''}`}
              onClick={() => handleUpgrade(plan.id)}
              disabled={isLoading || currentTier === plan.id}
            >
              {isLoading ? 'Processing...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* One-Off Purchase */}
      <div className="one-off-section">
        <h3>Need just one more ringtone?</h3>
        <p>Purchase a single additional export without committing to a subscription</p>
        <button
          className="one-off-button"
          onClick={handleOneOff}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : '💰 Buy One Export for $0.99'}
        </button>
      </div>

      {/* FAQ */}
      <div className="pricing-faq">
        <h3>Frequently Asked Questions</h3>

        <div className="faq-item">
          <h4>Can I cancel my subscription anytime?</h4>
          <p>Yes! You can cancel your subscription at any time. Your access continues until the end of your current billing period.</p>
        </div>

        <div className="faq-item">
          <h4>What happens if I downgrade?</h4>
          <p>Your account will be downgraded to the Free tier at the end of your current billing period. You'll keep access to your existing exports for 30 days.</p>
        </div>

        <div className="faq-item">
          <h4>Do you offer refunds?</h4>
          <p>Annual Premium subscriptions include a 30-day money-back guarantee. Monthly subscriptions can be cancelled to stop future charges, but we don't refund past billing periods.</p>
        </div>

        <div className="faq-item">
          <h4>Can I try Premium for free?</h4>
          <p>Yes! Start with our Free tier and upgrade whenever you're ready. Your first 3 exports are always on us.</p>
        </div>

        <div className="faq-item">
          <h4>What payment methods do you accept?</h4>
          <p>We accept all major credit/debit cards, Apple Pay, Google Pay, and PayPal through Stripe.</p>
        </div>

        <div className="faq-item">
          <h4>Are there any hidden fees?</h4>
          <p>No! The price you see is what you pay. No setup fees, no hidden charges, no surprises.</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="comparison-section">
        <h3>Detailed Feature Comparison</h3>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Free</th>
              <th>One-Off ($0.99)</th>
              <th>Premium ($2.99/mo)</th>
              <th>Premium Annual ($19.99/yr)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="feature-name">Monthly Exports</td>
              <td>3</td>
              <td>1</td>
              <td>Unlimited</td>
              <td>Unlimited</td>
            </tr>
            <tr>
              <td className="feature-name">Max Clip Length</td>
              <td>15 sec</td>
              <td>15 sec</td>
              <td>30 sec</td>
              <td>30 sec</td>
            </tr>
            <tr>
              <td className="feature-name">Max Bitrate</td>
              <td>128 kbps</td>
              <td>128 kbps</td>
              <td>320 kbps</td>
              <td>320 kbps</td>
            </tr>
            <tr>
              <td className="feature-name">Audio Formats</td>
              <td>MP3</td>
              <td>MP3</td>
              <td>MP3, WAV, M4R, OGG</td>
              <td>MP3, WAV, M4R, OGG, FLAC</td>
            </tr>
            <tr>
              <td className="feature-name">Cloud Backup</td>
              <td>✗</td>
              <td>✗</td>
              <td>30 days</td>
              <td>30 days</td>
            </tr>
            <tr>
              <td className="feature-name">Ad-Free</td>
              <td>✗</td>
              <td>✗</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td className="feature-name">Priority Support</td>
              <td>✗</td>
              <td>✗</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Trust Section */}
      <div className="trust-section">
        <h3>Why Choose HookRing?</h3>
        <div className="trust-items">
          <div className="trust-item">
            <span className="icon">🔒</span>
            <h4>Secure & Private</h4>
            <p>Your ringtones are encrypted and never shared</p>
          </div>
          <div className="trust-item">
            <span className="icon">⚡</span>
            <h4>Lightning Fast</h4>
            <p>Create ringtones in seconds, not minutes</p>
          </div>
          <div className="trust-item">
            <span className="icon">🎵</span>
            <h4>Studio Quality</h4>
            <p>Professional-grade audio optimization</p>
          </div>
          <div className="trust-item">
            <span className="icon">📱</span>
            <h4>Works Everywhere</h4>
            <p>iOS, Android, and web-compatible</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
