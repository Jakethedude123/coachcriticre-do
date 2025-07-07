"use client";

import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { CoachPlan, PLAN_BENEFITS, PLAN_PRICES } from '@/lib/firebase/models/coach';

interface TierSubscriptionProps {
  currentTier: CoachPlan;
  onSubscribe: (tier: CoachPlan) => Promise<void>;
}

export default function TierSubscription({ currentTier, onSubscribe }: TierSubscriptionProps) {
  const [selectedTier, setSelectedTier] = useState<CoachPlan>(currentTier);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (tier: CoachPlan) => {
    setIsLoading(true);
    setError(null);

    try {
      await onSubscribe(tier);
      setSelectedTier(tier);
    } catch (err) {
      setError('Failed to update subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBenefitStatus = (included: boolean) => {
    return included ? (
      <FaCheckCircle className="text-green-500" />
    ) : (
      <FaTimesCircle className="text-gray-300" />
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Choose Your Plan</h2>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Tier */}
        <div className={`
          p-6 rounded-lg border-2 
          ${selectedTier === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
        `}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="text-2xl font-bold mt-2">$0</p>
            <p className="text-gray-500 text-sm">Forever</p>
          </div>

          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.listedInPublicSearch)}
              <span>Listed in Public Search</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.reviewCodes !== 0)}
              <span>Review Codes</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.oneReviewPerClient)}
              <span>One Review Per Client</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.customBranding)}
              <span>Custom Branding</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.verifiedBadge)}
              <span>Verified Badge</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.insightDashboard)}
              <span>Insight Dashboard</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.eligibleForSpotlight)}
              <span>Eligible for Spotlight</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.priorityAccess)}
              <span>Priority Access</span>
            </li>
          </ul>

          <button
            disabled={true}
            className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Tier 1 */}
        <div className={`
          p-6 rounded-lg border-2 
          ${selectedTier === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
        `}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">Growth</h3>
            <p className="text-2xl font-bold mt-2">${PLAN_PRICES.basic}</p>
            <p className="text-gray-500 text-sm">per month</p>
          </div>

          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.listedInPublicSearch)}
              <span>Listed in Public Search</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.reviewCodes !== 0)}
              <span>Review Codes</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.oneReviewPerClient)}
              <span>One Review Per Client</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.customBranding)}
              <span>Custom Branding</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.verifiedBadge)}
              <span>Verified Badge</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.insightDashboard)}
              <span>Insight Dashboard</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.eligibleForSpotlight)}
              <span>Eligible for Spotlight</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.basic.priorityAccess)}
              <span>Priority Access</span>
            </li>
          </ul>

          <button
            onClick={() => handleSubscribe('basic')}
            disabled={isLoading || currentTier === 'basic'}
            className={`
              w-full mt-6 px-4 py-2 rounded-lg
              ${currentTier === 'basic'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : currentTier === 'basic' ? (
              'Current Plan'
            ) : (
              'Subscribe'
            )}
          </button>
        </div>

        {/* Tier 2 */}
        <div className={`
          p-6 rounded-lg border-2 
          ${selectedTier === 'pro' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
          relative overflow-hidden
        `}>
          {/* Popular Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Popular
            </span>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-2xl font-bold mt-2">${PLAN_PRICES.pro}</p>
            <p className="text-gray-500 text-sm">per month</p>
          </div>

          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.pro.listedInPublicSearch)}
              <span>Listed in Public Search</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.pro.reviewCodes === 'unlimited')}
              <span>Unlimited Review Codes</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.pro.oneReviewPerClient)}
              <span>One Review Per Client</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.pro.customBranding)}
              <span>Custom Branding</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.pro.verifiedBadge)}
              <span>Verified Badge</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.pro.insightDashboard)}
              <span>Insight Dashboard</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.pro.eligibleForSpotlight)}
              <span>Eligible for Spotlight</span>
            </li>
            <li className="flex items-center space-x-3">
              {renderBenefitStatus(PLAN_BENEFITS.pro.priorityAccess)}
              <span>Priority Access</span>
            </li>
          </ul>

          <button
            onClick={() => handleSubscribe('pro')}
            disabled={isLoading || currentTier === 'pro'}
            className={`
              w-full mt-6 px-4 py-2 rounded-lg
              ${currentTier === 'pro'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : currentTier === 'pro' ? (
              'Current Plan'
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        All plans include access to basic features. Upgrade anytime to unlock more benefits.
      </p>
    </div>
  );
} 