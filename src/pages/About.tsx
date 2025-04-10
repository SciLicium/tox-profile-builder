
import React from 'react';
import Layout from '../components/Layout';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">À propos de PreFillTox</h1>
        
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-tox-primary">Notre mission</h2>
          <p className="text-gray-700 mb-6">
            PreFillTox est une plateforme dédiée à faciliter l'évaluation de la sécurité des ingrédients cosmétiques 
            grâce à l'automatisation de la collecte et de l'analyse des données toxicologiques. 
            Notre objectif est de fournir aux professionnels de la cosmétique des profils toxicologiques 
            complets et à jour pour garantir la sécurité des consommateurs.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 text-tox-primary">Notre approche</h2>
          <p className="text-gray-700 mb-6">
            Nous combinons des techniques avancées d'extraction de données avec l'expertise de toxicologues 
            pour constituer des profils toxicologiques structurés selon les 11 sections requises pour 
            l'évaluation de la sécurité des ingrédients cosmétiques. Notre système collecte automatiquement 
            les informations pertinentes à partir de bases de données réglementaires et scientifiques reconnues.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 text-tox-primary">Notre équipe</h2>
          <p className="text-gray-700 mb-6">
            Notre équipe est composée de toxicologues, de chimistes et d'ingénieurs en informatique 
            spécialisés dans l'analyse de données. Ensemble, nous travaillons pour fournir des informations 
            fiables et actualisées sur la sécurité des ingrédients cosmétiques.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 text-tox-primary">Nos sources de données</h2>
          <p className="text-gray-700">
            Nos profils toxicologiques sont basés sur des données issues de sources faisant autorité, notamment :
          </p>
          <ul className="list-disc pl-8 mt-2 mb-6 text-gray-700 space-y-1">
            <li>La base de données CosIng de la Commission européenne</li>
            <li>Les dossiers d'enregistrement REACH de l'ECHA</li>
            <li>Les avis du Comité scientifique pour la sécurité des consommateurs (CSSC)</li>
            <li>La littérature scientifique évaluée par des pairs</li>
            <li>Les bases de données toxicologiques internationales</li>
          </ul>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mt-8">
            <h3 className="text-lg font-bold mb-2 text-tox-primary">Contactez-nous</h3>
            <p className="text-gray-700">
              Pour toute question concernant nos services ou pour obtenir plus d'informations, 
              n'hésitez pas à nous contacter à l'adresse : <span className="text-tox-primary font-medium">contact@prefilltox.com</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
