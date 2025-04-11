
import React from 'react';
import { SubstanceFormField } from './SubstanceFormField';

export const SubstanceIdentifiers: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SubstanceFormField
        name="casNumber"
        label="Numéro CAS"
        placeholder="ex: 79-14-1"
        description="Le numéro CAS est un identifiant unique pour les substances chimiques"
      />
      
      <SubstanceFormField
        name="smiles"
        label="SMILES"
        placeholder="ex: C(C(=O)O)O"
        description="Notation SMILES pour la structure moléculaire"
      />
    </div>
  );
};
