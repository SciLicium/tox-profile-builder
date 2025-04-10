
import React from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-tox-primary text-white shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-tox-primary font-bold text-xl">PT</span>
            </div>
            <span className="text-2xl font-bold">PreFillTox</span>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-tox-light">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-tox-light">
                  Historique
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-tox-light">
                  À propos
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-100 border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} PreFillTox. Tous droits réservés.</p>
          <p className="text-sm mt-2">
            Outil d'automatisation de profils toxicologiques pour l'évaluation de sécurité cosmétique.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
