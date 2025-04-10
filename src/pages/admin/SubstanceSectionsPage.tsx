
import React from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import SubstanceSections from '@/components/admin/SubstanceSections';

const SubstanceSectionsPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <SubstanceSections />
      </Layout>
    </ProtectedRoute>
  );
};

export default SubstanceSectionsPage;
