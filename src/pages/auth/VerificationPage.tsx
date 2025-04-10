
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inbox } from 'lucide-react';
import Layout from '@/components/Layout';

const VerificationPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto bg-green-100 p-4 rounded-full mb-4">
              <Inbox className="h-12 w-12 text-tox-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Vérifiez votre email</CardTitle>
            <CardDescription className="text-center">
              Nous avons envoyé un lien d'activation à votre adresse email. Veuillez cliquer sur ce lien pour activer votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            <p>N'oubliez pas de vérifier votre dossier de spam si vous ne trouvez pas l'email.</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Link to="/auth/login">
              <Button variant="outline" className="text-tox-primary hover:bg-tox-primary/10">
                Retour à la connexion
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VerificationPage;
