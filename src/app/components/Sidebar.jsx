'use client';

import Navigation from './Navigation';

export const Sidebar = () => {
  return (
    <div className='bg-primary-700 h-screen w-64'>
      <div className='flex h-full flex-col text-white'>
        {/* Logo */}
        <div className='border-primary-600 border-b p-6 hover-lift'>
          <div className='flex items-center gap-3'>
            <div className='flex size-8 items-center justify-center rounded-full bg-white transition-transform duration-200 hover:scale-110'>
              <span className='text-primary-700 text-sm font-bold'>P</span>
            </div>
            <span className='text-xl font-bold'>Portfos Console</span>
          </div>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Footer */}
        <div className='border-primary-600 border-t p-4'>
          <div className='text-primary-200 text-center'>
            <p className='text-xs'>© 2024 All Rights Reserved</p>
            <p className='mt-1 text-xs'>Made by Finarkein</p>
          </div>
        </div>
      </div>
    </div>
  );
};
