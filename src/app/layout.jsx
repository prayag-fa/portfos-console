import { Inter } from 'next/font/google';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import NotificationSystem from '@/components/ui/NotificationSystem';
import { AppProvider } from '@/lib/context/AppContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Portfos Console',
  description: 'Self Help Portal Dashboard'
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <AppProvider>
              {children}
              <NotificationSystem />
            </AppProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
