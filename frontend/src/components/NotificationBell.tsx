import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, AlertTriangle, Lightbulb, Scan, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, AppNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationBell: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    permissionStatus,
    requestPermission,
    isSupported,
  } = useNotifications();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'disease_alert':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'health_tip':
        return <Lightbulb className="h-4 w-4 text-accent-foreground" />;
      case 'scan_result':
        return <Scan className="h-4 w-4 text-primary" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleNotificationClick = (notification: AppNotification) => {
    markAsRead(notification.id);
    if (notification.data?.scanId) {
      setOpen(false);
    }
  };

  const handleEnableNotifications = async () => {
    await requestPermission();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-semibold">{t('notifications.title')}</h3>
          <div className="flex gap-1">
            {notifications.length > 0 && unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={markAllAsRead}
                title={t('notifications.markAllRead')}
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-destructive hover:text-destructive" 
                onClick={clearNotifications}
                title={t('notifications.clearAll')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {permissionStatus !== 'granted' && isSupported && (
          <div className="border-b bg-accent/10 p-3">
            <p className="mb-2 text-sm text-muted-foreground">
              {t('notifications.enablePrompt')}
            </p>
            <Button size="sm" onClick={handleEnableNotifications} className="w-full">
              <Bell className="mr-2 h-4 w-4" />
              {t('notifications.enable')}
            </Button>
          </div>
        )}

        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t('notifications.empty')}</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer p-3 transition-colors hover:bg-muted/50 ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.data?.scanId ? (
                    <Link to={`/scan/${notification.data.scanId}`} className="block">
                      <NotificationItem notification={notification} getIcon={getIcon} />
                    </Link>
                  ) : (
                    <NotificationItem notification={notification} getIcon={getIcon} />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

const NotificationItem: React.FC<{
  notification: AppNotification;
  getIcon: (type: AppNotification['type']) => React.ReactNode;
}> = ({ notification, getIcon }) => (
  <div className="flex gap-3">
    <div className="mt-0.5">{getIcon(notification.type)}</div>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium leading-tight">{notification.title}</p>
      <p className="text-xs text-muted-foreground">{notification.message}</p>
      <p className="text-[10px] text-muted-foreground">
        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
      </p>
    </div>
    {!notification.read && (
      <div className="h-2 w-2 rounded-full bg-primary" />
    )}
  </div>
);

export default NotificationBell;
