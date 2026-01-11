import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLanguage } from './LanguageContext';

export interface AppNotification {
  id: string;
  type: 'disease_alert' | 'health_tip' | 'scan_result' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: {
    scanId?: string;
    disease?: string;
    breed?: string;
  };
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  permissionStatus: NotificationPermission | 'unsupported';
  requestPermission: () => Promise<boolean>;
  sendNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  sendDiseaseAlert: (disease: string, confidence: number, scanId: string) => void;
  sendHealthTip: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  isSupported: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Health tips in multiple languages
const HEALTH_TIPS: Record<string, { title: string; tips: string[] }> = {
  en: {
    title: '🐄 Cattle Health Tip',
    tips: [
      'Ensure your cattle have access to clean, fresh water at all times.',
      'Regular deworming helps prevent parasitic infections and improves cattle health.',
      'Vaccinate your cattle against Foot and Mouth Disease every 6 months.',
      'Provide shade and proper ventilation during hot weather to prevent heat stress.',
      'Inspect cattle hooves regularly to prevent lameness and infections.',
      'Maintain a balanced diet with proper mineral supplements for optimal health.',
      'Isolate sick animals immediately to prevent disease spread.',
      'Keep cattle housing clean and dry to reduce disease risk.',
      'Regular grooming helps detect early signs of skin diseases like ringworm.',
      'Monitor cattle behavior daily - changes may indicate health issues.',
    ],
  },
  hi: {
    title: '🐄 पशु स्वास्थ्य सुझाव',
    tips: [
      'सुनिश्चित करें कि आपके मवेशियों को हमेशा साफ, ताजा पानी मिले।',
      'नियमित कृमिनाशक दवा परजीवी संक्रमण को रोकने में मदद करती है।',
      'हर 6 महीने में खुरपका-मुंहपका रोग का टीकाकरण कराएं।',
      'गर्म मौसम में छाया और उचित हवादारी प्रदान करें।',
      'लंगड़ापन और संक्रमण रोकने के लिए नियमित रूप से खुरों की जांच करें।',
      'इष्टतम स्वास्थ्य के लिए उचित खनिज पूरक के साथ संतुलित आहार दें।',
      'बीमारी फैलने से रोकने के लिए बीमार जानवरों को तुरंत अलग करें।',
      'रोग के खतरे को कम करने के लिए आवास को साफ और सूखा रखें।',
      'नियमित सफाई से दाद जैसी त्वचा रोगों का जल्दी पता चलता है।',
      'प्रतिदिन मवेशियों के व्यवहार की निगरानी करें।',
    ],
  },
  mr: {
    title: '🐄 पशु आरोग्य टीप',
    tips: [
      'तुमच्या गुरांना नेहमी स्वच्छ, ताजे पाणी मिळेल याची खात्री करा।',
      'नियमित जंतनाशक परजीवी संसर्ग रोखण्यास मदत करते।',
      'दर 6 महिन्यांनी खुरपका-तोंडपका रोगाचे लसीकरण करा।',
      'उष्ण हवामानात सावली आणि योग्य वायुवीजन द्या।',
      'लंगडेपणा आणि संसर्ग टाळण्यासाठी नियमितपणे खुरांची तपासणी करा।',
      'इष्टतम आरोग्यासाठी योग्य खनिज पूरक आहार द्या।',
      'रोग पसरू नये म्हणून आजारी जनावरांना लगेच वेगळे करा।',
      'रोगाचा धोका कमी करण्यासाठी निवारा स्वच्छ आणि कोरडा ठेवा।',
      'नियमित स्वच्छतेमुळे त्वचा रोगांचे लवकर निदान होते।',
      'दररोज गुरांच्या वर्तनावर लक्ष ठेवा।',
    ],
  },
};

const DISEASE_ALERTS: Record<string, Record<string, { title: string; urgency: string }>> = {
  en: {
    'Foot and Mouth Disease': { title: '⚠️ Disease Alert: Foot and Mouth Disease', urgency: 'Seek veterinary care immediately!' },
    'Lumpy Skin Disease': { title: '⚠️ Disease Alert: Lumpy Skin Disease', urgency: 'Isolate the animal and consult a vet!' },
    'Mastitis': { title: '⚠️ Disease Alert: Mastitis', urgency: 'Start treatment early to prevent complications.' },
    'Bloat': { title: '🚨 Urgent: Bloat Detected', urgency: 'This is an emergency! Seek immediate help!' },
    'Ringworm': { title: '⚠️ Disease Alert: Ringworm', urgency: 'Treat promptly to prevent spread.' },
  },
  hi: {
    'Foot and Mouth Disease': { title: '⚠️ रोग चेतावनी: खुरपका-मुंहपका', urgency: 'तुरंत पशु चिकित्सक से संपर्क करें!' },
    'Lumpy Skin Disease': { title: '⚠️ रोग चेतावनी: गांठदार त्वचा रोग', urgency: 'जानवर को अलग करें और पशु चिकित्सक से परामर्श लें!' },
    'Mastitis': { title: '⚠️ रोग चेतावनी: थनैला', urgency: 'जटिलताओं से बचने के लिए जल्दी उपचार शुरू करें।' },
    'Bloat': { title: '🚨 आपातकालीन: पेट फूलना', urgency: 'यह आपातकाल है! तुरंत मदद लें!' },
    'Ringworm': { title: '⚠️ रोग चेतावनी: दाद', urgency: 'फैलने से रोकने के लिए तुरंत इलाज करें।' },
  },
  mr: {
    'Foot and Mouth Disease': { title: '⚠️ रोग इशारा: खुरपका-तोंडपका', urgency: 'ताबडतोब पशुवैद्याशी संपर्क साधा!' },
    'Lumpy Skin Disease': { title: '⚠️ रोग इशारा: गाठदार त्वचा रोग', urgency: 'जनावराला वेगळे करा आणि पशुवैद्याचा सल्ला घ्या!' },
    'Mastitis': { title: '⚠️ रोग इशारा: कासदाह', urgency: 'गुंतागुंत टाळण्यासाठी लवकर उपचार सुरू करा।' },
    'Bloat': { title: '🚨 आणीबाणी: पोट फुगणे', urgency: 'हे आणीबाणी आहे! ताबडतोब मदत घ्या!' },
    'Ringworm': { title: '⚠️ रोग इशारा: नाखूद', urgency: 'पसरू नये म्हणून त्वरित उपचार करा।' },
  },
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('cattlecare-notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) }));
    }
    return [];
  });
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');

  const isSupported = 'Notification' in window;

  useEffect(() => {
    if (isSupported) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus('unsupported');
    }
  }, [isSupported]);

  useEffect(() => {
    localStorage.setItem('cattlecare-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Health tip interval - send a tip every hour (demo: every 5 minutes)
  useEffect(() => {
    if (permissionStatus !== 'granted') return;

    const tipInterval = setInterval(() => {
      sendHealthTip();
    }, 5 * 60 * 1000); // 5 minutes for demo

    return () => clearInterval(tipInterval);
  }, [permissionStatus, language]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const showBrowserNotification = useCallback((title: string, body: string, icon?: string) => {
    if (permissionStatus === 'granted' && isSupported) {
      try {
        new Notification(title, {
          body,
          icon: icon || '/favicon.ico',
          badge: '/favicon.ico',
          tag: `cattlecare-${Date.now()}`,
          requireInteraction: false,
        });
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }, [permissionStatus, isSupported]);

  const sendNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50

    // Show browser notification
    showBrowserNotification(notification.title, notification.message);
  }, [showBrowserNotification]);

  const sendDiseaseAlert = useCallback((disease: string, confidence: number, scanId: string) => {
    if (disease === 'Healthy') return;

    const alerts = DISEASE_ALERTS[language] || DISEASE_ALERTS.en;
    const alertInfo = alerts[disease] || { 
      title: `⚠️ Disease Alert: ${disease}`, 
      urgency: 'Consult a veterinarian.' 
    };

    sendNotification({
      type: 'disease_alert',
      title: alertInfo.title,
      message: `${alertInfo.urgency} (Confidence: ${confidence.toFixed(1)}%)`,
      data: { scanId, disease },
    });
  }, [language, sendNotification]);

  const sendHealthTip = useCallback(() => {
    const tips = HEALTH_TIPS[language] || HEALTH_TIPS.en;
    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

    sendNotification({
      type: 'health_tip',
      title: tips.title,
      message: randomTip,
    });
  }, [language, sendNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        permissionStatus,
        requestPermission,
        sendNotification,
        sendDiseaseAlert,
        sendHealthTip,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        isSupported,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
