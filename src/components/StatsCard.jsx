import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const CardValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const CardChange = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: ${props => props.isPositive ? '#5cb85c' : '#d9534f'};
  margin-top: auto;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => `${props.color}15` || '#f5f5f5'};
  color: ${props => props.color || '#666'};
  margin-bottom: 16px;
  
  svg {
    font-size: 20px;
  }
`;

function StatsCard({ title, value, change, isPositive, icon, color }) {
  return (
    <CardContainer>
      {icon && <IconContainer color={color}>{icon}</IconContainer>}
      <CardTitle>{title}</CardTitle>
      <CardValue>{value}</CardValue>
      {change && (
        <CardChange isPositive={isPositive}>
          {isPositive ? '↑' : '↓'} {change}
        </CardChange>
      )}
    </CardContainer>
  );
}

export default StatsCard;
