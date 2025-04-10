
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircle, LogOut, Settings, Users } from 'lucide-react';

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl text-tox-primary">
          PreFillTox
        </Link>
        
        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/" className="text-gray-700 hover:text-tox-primary">
            Accueil
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-tox-primary">
            À propos
          </Link>
          
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex gap-2 items-center">
                    <UserCircle className="h-5 w-5" />
                    <span className="max-w-[100px] truncate">
                      {profile?.first_name || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  {(profile?.role === 'admin') && (
                    <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Gestion des utilisateurs</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate('/auth/login')} className="bg-tox-primary hover:bg-tox-secondary">
              Se connecter
            </Button>
          )}
        </nav>
        
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/">Accueil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/about">À propos</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user ? (
                <>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profil
                  </DropdownMenuItem>
                  {(profile?.role === 'admin') && (
                    <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                      Gestion des utilisateurs
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Déconnexion
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate('/auth/login')}>
                  Se connecter
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
