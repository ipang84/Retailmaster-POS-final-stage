import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMenu, FiUser, FiLogOut, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 64px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
  
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
  
  @media (min-width: 992px) {
    display: none;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 10;
  margin-top: 8px;
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: #333;
    text-decoration: none;
    
    svg {
      margin-right: 12px;
      color: #666;
    }
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    
    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;

function Header({ toggleSidebar }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <HeaderContainer>
      <MenuButton onClick={toggleSidebar}>
        <FiMenu />
      </MenuButton>
      
      <Logo>
        <Link to="/">RetailMaster POS</Link>
      </Logo>
      
      <HeaderActions>
        <UserMenu>
          <UserButton onClick={toggleUserMenu}>
            <FiUser />
            Admin
          </UserButton>
          
          {showUserMenu && (
            <UserMenuDropdown>
              <Link to="/settings" className="menu-item" onClick={() => setShowUserMenu(false)}>
                <FiUser />
                Profile
              </Link>
              <Link to="/settings" className="menu-item" onClick={() => setShowUserMenu(false)}>
                <FiClock />
                Activity Log
              </Link>
              <Link to="/" className="menu-item" onClick={() => setShowUserMenu(false)}>
                <FiLogOut />
                Logout
              </Link>
            </UserMenuDropdown>
          )}
        </UserMenu>
      </HeaderActions>
    </HeaderContainer>
  );
}

export default Header;
