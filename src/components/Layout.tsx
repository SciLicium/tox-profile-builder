
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">PreFillTox</h3>
              <p className="text-gray-300 text-sm">
                Profils toxicologiques automatisés pour l'évaluation de sécurité cosmétique
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-300 text-sm">
                © {new Date().getFullYear()} PreFillTox. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
