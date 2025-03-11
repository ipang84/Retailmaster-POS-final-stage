import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const AccessoriesContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
`;

function Accessories() {
  return (
    <PageContainer>
      <PageHeader>
        <Title>Accessories</Title>
      </PageHeader>
      
      <AccessoriesContainer>
        <EmptyState>
          <p>No accessories found.</p>
          <p>This page will allow you to manage retail accessories and peripherals.</p>
        </EmptyState>
      </AccessoriesContainer>
    </PageContainer>
  );
}

export default Accessories;
