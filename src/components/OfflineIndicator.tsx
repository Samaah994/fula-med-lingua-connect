
import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const OfflineIndicator: React.FC = () => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md p-3 mb-4">
      <div className="flex items-center">
        <WifiOff className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
        <div>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {t('offlineMode')}
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            {t('speechRecognitionRequiresInternet')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
