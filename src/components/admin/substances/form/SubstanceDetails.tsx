
import React from 'react';
import { SubstanceFormField } from './SubstanceFormField';

export const SubstanceDetails: React.FC = () => {
  return (
    <>
      <SubstanceFormField
        name="regulatoryStatus"
        label="Statut réglementaire"
        placeholder="ex: Autorisé dans les cosmétiques (EU)"
      />
      
      <SubstanceFormField
        name="description"
        label="Description"
        placeholder="Description de la substance..."
        type="textarea"
      />
      
      <SubstanceFormField
        name="isDraft"
        label="Sauvegarder comme brouillon"
        description="Les brouillons ne sont visibles que par les administrateurs"
        type="checkbox"
      />
    </>
  );
};
