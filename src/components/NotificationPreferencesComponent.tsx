import { useState } from 'react';
import { Coach } from '@/lib/firebase/models/coach';
import type { NotificationPreferences } from '@/lib/firebase/models/coach';
import { updateCoachProfile } from '@/lib/firebase/coachUtils';
import { FaBell, FaEnvelope, FaMobile } from 'react-icons/fa';

interface NotificationPreferencesProps {
  coach: Coach;
  onUpdate: () => void;
}

export default function NotificationPreferencesComponent({ coach, onUpdate }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      enabled: true,
      address: coach.email,
      notifications: {
        profileViews: true,
        searchAppearances: true,
        profileClicks: true
      }
    },
    sms: {
      enabled: false,
      phoneNumber: '',
      notifications: {
        profileViews: false,
        searchAppearances: false,
        profileClicks: false
      }
    }
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);

  const handleEmailToggle = (type: keyof NotificationPreferences['email']['notifications']) => {
    setPreferences(prev => ({
      ...prev,
      email: {
        ...prev.email,
        notifications: {
          ...prev.email.notifications,
          [type]: !prev.email.notifications[type]
        }
      }
    }));
  };

  const handleSMSToggle = (type: keyof NotificationPreferences['sms']['notifications']) => {
    setPreferences(prev => ({
      ...prev,
      sms: {
        ...prev.sms,
        notifications: {
          ...prev.sms.notifications,
          [type]: !prev.sms.notifications[type]
        }
      }
    }));
  };

  const handleSMSEnable = (enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      sms: {
        ...prev.sms,
        enabled,
        notifications: enabled ? {
          profileViews: true,
          searchAppearances: true,
          profileClicks: true
        } : {
          profileViews: false,
          searchAppearances: false,
          profileClicks: false
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCoachProfile(coach.userId, {
        notificationPreferences: {
          ...preferences,
          sms: {
            ...preferences.sms,
            phoneNumber
          }
        }
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

      {/* Email Notifications */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FaEnvelope className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
        </div>
        <div className="space-y-4 ml-7">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email-profile-views"
              checked={preferences.email.notifications.profileViews}
              onChange={() => handleEmailToggle('profileViews')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="email-profile-views" className="ml-2 text-gray-700">
              Profile Views
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email-search-appearances"
              checked={preferences.email.notifications.searchAppearances}
              onChange={() => handleEmailToggle('searchAppearances')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="email-search-appearances" className="ml-2 text-gray-700">
              Search Appearances
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email-profile-clicks"
              checked={preferences.email.notifications.profileClicks}
              onChange={() => handleEmailToggle('profileClicks')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="email-profile-clicks" className="ml-2 text-gray-700">
              Profile Clicks
            </label>
          </div>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FaMobile className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">SMS Notifications</h3>
        </div>
        <div className="space-y-4 ml-7">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="sms-enable"
              checked={preferences.sms.enabled}
              onChange={(e) => handleSMSEnable(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="sms-enable" className="ml-2 text-gray-700">
              Enable SMS Notifications
            </label>
          </div>

          {preferences.sms.enabled && (
            <>
              <div className="mb-4">
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 555-5555"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Your phone number will be kept private and only used for notifications.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sms-profile-views"
                    checked={preferences.sms.notifications.profileViews}
                    onChange={() => handleSMSToggle('profileViews')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="sms-profile-views" className="ml-2 text-gray-700">
                    Profile Views
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sms-search-appearances"
                    checked={preferences.sms.notifications.searchAppearances}
                    onChange={() => handleSMSToggle('searchAppearances')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="sms-search-appearances" className="ml-2 text-gray-700">
                    Search Appearances
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sms-profile-clicks"
                    checked={preferences.sms.notifications.profileClicks}
                    onChange={() => handleSMSToggle('profileClicks')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="sms-profile-clicks" className="ml-2 text-gray-700">
                    Profile Clicks
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
} 