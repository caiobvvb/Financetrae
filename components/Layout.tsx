import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative h-full">
        <div className="min-h-full p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;