'use client';

import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

import Button from './Button';
import Modal from './Modal';

const DialogTypes = {
  warning: {
    icon: AlertTriangle,
    className: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    variant: 'warning'
  },
  info: {
    icon: Info,
    className: 'text-blue-600 bg-blue-50 border-blue-200',
    variant: 'primary'
  },
  success: {
    icon: CheckCircle,
    className: 'text-green-600 bg-green-50 border-green-200',
    variant: 'success'
  }
};

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false
}) {
  const dialogType = DialogTypes[type] || DialogTypes.warning;
  const Icon = dialogType.icon;

  const header = (
    <div className='flex items-center space-x-3'>
      <div className={`rounded-lg p-2 ${dialogType.className}`}>
        <Icon className='size-5' />
      </div>
      <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
    </div>
  );

  const footer = (
    <>
      <Button variant='secondary' onClick={onClose} disabled={isLoading}>
        {cancelText}
      </Button>
      <Button
        variant={dialogType.variant}
        onClick={onConfirm}
        loading={isLoading}
        disabled={isLoading}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm' header={header} footer={footer}>
      <p className='text-sm text-gray-600'>{message}</p>
    </Modal>
  );
}
