
import React from 'react';
import { SubstanceFormField } from './SubstanceFormField';

export const SubstanceBasicInfo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SubstanceFormField
        name="name"
        label="Nom de la substance"
        placeholder="ex: Acide glycolique"
        required={true}
      />
      
      <SubstanceFormField
        name="inciName"
        label="Nom INCI"
        placeholder="ex: Glycolic Acid"
      />
    </div>
  );
};
