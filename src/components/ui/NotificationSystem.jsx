'use client';

import { useEffect, useState } from 'react';

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

import { useAppContext } from '@/lib/context/AppContext';

const NotificationTypes = {
  success: { icon: CheckCircle, className: 'bg-green-50 border-green-200 text-green-800' },
  error: { icon: AlertCircle, className: 'bg-red-50 border-red-200 text-red-800' },
  warning: { icon: AlertTriangle, className: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  info: { icon: Info, className: 'bg-blue-50 border-blue-200 text-blue-800' }
};

function NotificationItem({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const type = NotificationTypes[notification.type] || NotificationTypes.info;
  const Icon = type.icon;

  return (
    <div
      className={`fixed right-4 top-4 z-50 w-full max-w-sm transition-all duration-300 ease-out ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className={`flex items-start rounded-lg border p-4 shadow-lg ${type.className}`}>
        <Icon className='mt-0.5 size-5 shrink-0' />
        <div className='ml-3 flex-1'>
          {notification.title && <h4 className='text-sm font-medium'>{notification.title}</h4>}
          <p className='mt-1 text-sm'>{notification.message}</p>
        </div>
        <button
          onClick={handleClose}
          className='ml-4 shrink-0 opacity-70 transition-all duration-200 ease-out hover:opacity-100 hover:scale-110 '
        >
          <X className='size-4' />
        </button>
      </div>
    </div>
  );
}

export default function NotificationSystem() {
  const { notification, actions } = useAppContext();

  if (!notification) {
    return null;
  }

  return <NotificationItem notification={notification} onClose={actions.clearNotification} />;
}
