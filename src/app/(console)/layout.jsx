'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts';
import PageTransition from '@/components/ui/PageTransition';
import { PageProvider } from '@/lib/context/PageContext';
import { KEYBOARD_SHORTCUTS, useKeyboardNavigation } from '@/lib/utils/keyboardNavigation';

import Header from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export default function ConsoleLayout({ children }) {
  const router = useRouter();
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const handleKeyboardAction = (shortcut, _event) => {
    switch (shortcut.action) {
      case 'navigate':
        router.push(shortcut.target);
        break;
      case 'refresh':
        // Trigger refresh - this could be passed down as a prop
        window.location.reload();
        break;
      case 'search':
        // Focus search input - this would need to be implemented in child components
        const searchInput = document.querySelector(
          'input[type="search"], input[placeholder*="search"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
        break;
      case 'filter':
        // Focus filter dropdown - this would need to be implemented in child components
        const filterButton = document.querySelector('[data-filter-button]');
        if (filterButton) {
          filterButton.click();
        }
        break;
      case 'clear':
        // Clear filters - this would need to be implemented in child components
        const clearButton = document.querySelector('[data-clear-filters]');
        if (clearButton) {
          clearButton.click();
        }
        break;
      case 'help':
        setShowKeyboardHelp(true);
        break;
    }
  };

  useKeyboardNavigation(KEYBOARD_SHORTCUTS, handleKeyboardAction);

  return (
    <PageProvider>
      <div className='flex h-screen bg-gray-100'>
        {/* Sidebar */}
        <div className='flex w-64 flex-col border-r border-gray-200 bg-white'>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className='flex flex-1 flex-col overflow-hidden'>
          <Header />
          <main className='flex-1 overflow-auto p-6 h-[calc(100vh-126px)]'>
            <PageTransition>{children}</PageTransition>
          </main>
        </div>

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcuts isOpen={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} />
      </div>
    </PageProvider>
  );
}
