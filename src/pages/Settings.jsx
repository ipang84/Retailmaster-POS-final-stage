import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSave, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { getSettings, updateSettings } from '../services/settingsService';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
`;

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsNav = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
  }
`;

const NavItem = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-left: 3px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  background-color: ${props => props.active ? '#f5f9ff' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : '#555'};
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: 768px) {
    border-left: none;
    border-radius: 4px;
    padding: 8px 12px;
  }
`;

const SettingsContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    font-size: 14px;
    outline: none;
    
    &:focus {
      border-color: var(--primary-color);
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: #0055cc;
    }
  }
  
  &.secondary {
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BusinessHoursGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 1fr;
  gap: 12px;
  align-items: center;
  
  .day-label {
    font-weight: 500;
  }
  
  .closed-text {
    color: #999;
    font-style: italic;
    grid-column: 2 / span 2;
  }
  
  .hours-toggle {
    margin-left: 8px;
    font-size: 13px;
    color: var(--primary-color);
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  
  .checkbox-item {
    display: flex;
    align-items: center;
    
    input {
      width: auto;
      margin-right: 8px;
    }
    
    label {
      margin-bottom: 0;
      cursor: pointer;
    }
  }
`;

const TaxSettingsGroup = styled.div`
  .tax-rate-input {
    display: flex;
    align-items: center;
    
    input {
      max-width: 100px;
    }
    
    .percent-sign {
      margin-left: 8px;
    }
  }
  
  .tax-options {
    margin-top: 16px;
  }
`;

const NotificationBanner = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 4px;
  background-color: ${props => props.type === 'success' ? '#e6ffe6' : '#fff0e6'};
  color: ${props => props.type === 'success' ? '#00cc66' : '#ff6600'};
  
  svg {
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .message {
    flex: 1;
  }
  
  .close {
    cursor: pointer;
    font-weight: bold;
    padding: 0 4px;
  }
`;

function Settings() {
  const [activeSection, setActiveSection] = useState('storeInfo');
  const [settings, setSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Load settings on component mount
  useEffect(() => {
    const storedSettings = getSettings();
    setSettings(storedSettings);
  }, []);
  
  const handleInputChange = (section, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };
  
  const handleNestedInputChange = (section, parent, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [parent]: {
          ...prevSettings[section][parent],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };
  
  const handleBusinessHoursChange = (day, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      storeInfo: {
        ...prevSettings.storeInfo,
        businessHours: {
          ...prevSettings.storeInfo.businessHours,
          [day]: {
            ...prevSettings.storeInfo.businessHours[day],
            [field]: value
          }
        }
      }
    }));
    setHasChanges(true);
  };
  
  const toggleDayClosed = (day) => {
    const isDayClosed = !settings.storeInfo.businessHours[day].open && !settings.storeInfo.businessHours[day].close;
    
    if (isDayClosed) {
      // If day was closed, set default hours
      handleBusinessHoursChange(day, 'open', '09:00');
      handleBusinessHoursChange(day, 'close', '17:00');
    } else {
      // If day was open, set to closed
      handleBusinessHoursChange(day, 'open', '');
      handleBusinessHoursChange(day, 'close', '');
    }
  };
  
  const handleCheckboxChange = (section, field) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: !prevSettings[section][field]
      }
    }));
    setHasChanges(true);
  };
  
  const handleSave = () => {
    // Save each section that might have changed
    const sections = ['storeInfo', 'taxSettings', 'paymentMethods', 'notifications', 'appearance'];
    
    let allSuccess = true;
    
    sections.forEach(section => {
      if (settings[section]) {
        const success = updateSettings(section, settings[section]);
        if (!success) allSuccess = false;
      }
    });
    
    if (allSuccess) {
      setNotification({
        type: 'success',
        message: 'Settings saved successfully!'
      });
      setHasChanges(false);
    } else {
      setNotification({
        type: 'error',
        message: 'There was a problem saving your settings. Please try again.'
      });
    }
    
    // Auto-dismiss notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const handleReset = () => {
    // Reset to stored settings
    const storedSettings = getSettings();
    setSettings(storedSettings);
    setHasChanges(false);
  };
  
  const renderStoreInfoSection = () => {
    if (!settings.storeInfo) return null;
    
    return (
      <>
        <SectionTitle>Store Information</SectionTitle>
        
        <FormGroup>
          <label>Store Name</label>
          <input 
            type="text" 
            value={settings.storeInfo.name || ''} 
            onChange={(e) => handleInputChange('storeInfo', 'name', e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <label>Store Email</label>
          <input 
            type="email" 
            value={settings.storeInfo.email || ''} 
            onChange={(e) => handleInputChange('storeInfo', 'email', e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <label>Phone Number</label>
          <input 
            type="tel" 
            value={settings.storeInfo.phone || ''} 
            onChange={(e) => handleInputChange('storeInfo', 'phone', e.target.value)}
            placeholder="Enter store phone number"
          />
        </FormGroup>
        
        <FormGroup>
          <label>Address</label>
          <textarea 
            value={settings.storeInfo.address || ''} 
            onChange={(e) => handleInputChange('storeInfo', 'address', e.target.value)}
            placeholder="Enter store address"
          ></textarea>
        </FormGroup>
        
        <FormGroup>
          <label>Business Hours</label>
          <BusinessHoursGrid>
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
              const dayData = settings.storeInfo.businessHours[day];
              const isClosed = !dayData.open && !dayData.close;
              
              return (
                <React.Fragment key={day}>
                  <div className="day-label">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                    <span 
                      className="hours-toggle" 
                      onClick={() => toggleDayClosed(day)}
                    >
                      {isClosed ? 'Set hours' : 'Mark closed'}
                    </span>
                  </div>
                  
                  {isClosed ? (
                    <div className="closed-text">Closed</div>
                  ) : (
                    <>
                      <input 
                        type="time" 
                        value={dayData.open || ''} 
                        onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                      />
                      <input 
                        type="time" 
                        value={dayData.close || ''} 
                        onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </BusinessHoursGrid>
        </FormGroup>
      </>
    );
  };
  
  const renderTaxSettingsSection = () => {
    if (!settings.taxSettings) return null;
    
    return (
      <>
        <SectionTitle>Tax Settings</SectionTitle>
        
        <FormGroup>
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="enableTax" 
              checked={settings.taxSettings.enableTax} 
              onChange={() => handleCheckboxChange('taxSettings', 'enableTax')}
            />
            <label htmlFor="enableTax">Enable Sales Tax</label>
          </div>
        </FormGroup>
        
        <TaxSettingsGroup>
          <FormGroup>
            <label>Tax Rate</label>
            <div className="tax-rate-input">
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="100" 
                value={settings.taxSettings.taxRate} 
                onChange={(e) => handleInputChange('taxSettings', 'taxRate', parseFloat(e.target.value))}
                disabled={!settings.taxSettings.enableTax}
              />
              <span className="percent-sign">%</span>
            </div>
          </FormGroup>
          
          <div className="tax-options">
            <FormGroup>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="taxInclusive" 
                  checked={settings.taxSettings.taxInclusive} 
                  onChange={() => handleCheckboxChange('taxSettings', 'taxInclusive')}
                  disabled={!settings.taxSettings.enableTax}
                />
                <label htmlFor="taxInclusive">Prices include tax</label>
              </div>
            </FormGroup>
            
            <FormGroup>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="applyToShipping" 
                  checked={settings.taxSettings.applyToShipping} 
                  onChange={() => handleCheckboxChange('taxSettings', 'applyToShipping')}
                  disabled={!settings.taxSettings.enableTax}
                />
                <label htmlFor="applyToShipping">Apply tax to shipping</label>
              </div>
            </FormGroup>
          </div>
        </TaxSettingsGroup>
      </>
    );
  };
  
  const renderPaymentMethodsSection = () => {
    if (!settings.paymentMethods) return null;
    
    const paymentOptions = [
      { id: 'cash', label: 'Cash' },
      { id: 'creditCard', label: 'Credit Card' },
      { id: 'debitCard', label: 'Debit Card' },
      { id: 'check', label: 'Check' },
      { id: 'paypal', label: 'PayPal' },
      { id: 'venmo', label: 'Venmo' },
      { id: 'applePay', label: 'Apple Pay' },
      { id: 'googlePay', label: 'Google Pay' }
    ];
    
    return (
      <>
        <SectionTitle>Payment Methods</SectionTitle>
        
        <FormGroup>
          <label>Accepted Payment Methods</label>
          <CheckboxGroup>
            {paymentOptions.map(option => (
              <div className="checkbox-item" key={option.id}>
                <input 
                  type="checkbox" 
                  id={option.id} 
                  checked={settings.paymentMethods[option.id]} 
                  onChange={() => handleCheckboxChange('paymentMethods', option.id)}
                />
                <label htmlFor={option.id}>{option.label}</label>
              </div>
            ))}
          </CheckboxGroup>
        </FormGroup>
      </>
    );
  };
  
  const renderNotificationsSection = () => {
    if (!settings.notifications) return null;
    
    const notificationOptions = [
      { id: 'lowStock', label: 'Low Stock Alerts' },
      { id: 'newOrders', label: 'New Order Notifications' },
      { id: 'customerReturns', label: 'Customer Returns' },
      { id: 'dailySummary', label: 'Daily Sales Summary' }
    ];
    
    return (
      <>
        <SectionTitle>Notifications</SectionTitle>
        
        <FormGroup>
          <label>Enable Notifications</label>
          <CheckboxGroup>
            {notificationOptions.map(option => (
              <div className="checkbox-item" key={option.id}>
                <input 
                  type="checkbox" 
                  id={option.id} 
                  checked={settings.notifications[option.id]} 
                  onChange={() => handleCheckboxChange('notifications', option.id)}
                />
                <label htmlFor={option.id}>{option.label}</label>
              </div>
            ))}
          </CheckboxGroup>
        </FormGroup>
      </>
    );
  };
  
  const renderAppearanceSection = () => {
    if (!settings.appearance) return null;
    
    return (
      <>
        <SectionTitle>Appearance</SectionTitle>
        
        <FormGroup>
          <label>Theme</label>
          <select 
            value={settings.appearance.theme} 
            onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </FormGroup>
        
        <FormGroup>
          <label>Accent Color</label>
          <input 
            type="color" 
            value={settings.appearance.accentColor} 
            onChange={(e) => handleInputChange('appearance', 'accentColor', e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <div className="checkbox-item">
            <input 
              type="checkbox" 
              id="compactMode" 
              checked={settings.appearance.compactMode} 
              onChange={() => handleCheckboxChange('appearance', 'compactMode')}
            />
            <label htmlFor="compactMode">Compact Mode</label>
          </div>
        </FormGroup>
      </>
    );
  };
  
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'storeInfo':
        return renderStoreInfoSection();
      case 'taxSettings':
        return renderTaxSettingsSection();
      case 'paymentMethods':
        return renderPaymentMethodsSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'appearance':
        return renderAppearanceSection();
      default:
        return renderStoreInfoSection();
    }
  };
  
  return (
    <div>
      <PageHeader>
        <Title>Settings</Title>
        <ButtonGroup>
          <Button 
            className="secondary" 
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <FiRefreshCw />
            Reset Changes
          </Button>
          <Button 
            className="primary" 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <FiSave />
            Save Changes
          </Button>
        </ButtonGroup>
      </PageHeader>
      
      {notification && (
        <NotificationBanner type={notification.type}>
          <FiAlertCircle />
          <div className="message">{notification.message}</div>
          <div className="close" onClick={() => setNotification(null)}>×</div>
        </NotificationBanner>
      )}
      
      <SettingsContainer>
        <SettingsNav>
          <NavItem 
            active={activeSection === 'storeInfo'} 
            onClick={() => setActiveSection('storeInfo')}
          >
            Store Information
          </NavItem>
          <NavItem 
            active={activeSection === 'taxSettings'} 
            onClick={() => setActiveSection('taxSettings')}
          >
            Tax Settings
          </NavItem>
          <NavItem 
            active={activeSection === 'paymentMethods'} 
            onClick={() => setActiveSection('paymentMethods')}
          >
            Payment Methods
          </NavItem>
          <NavItem 
            active={activeSection === 'notifications'} 
            onClick={() => setActiveSection('notifications')}
          >
            Notifications
          </NavItem>
          <NavItem 
            active={activeSection === 'appearance'} 
            onClick={() => setActiveSection('appearance')}
          >
            Appearance
          </NavItem>
        </SettingsNav>
        
        <SettingsContent>
          {renderActiveSection()}
          
          <ButtonGroup>
            <Button 
              className="secondary" 
              onClick={handleReset}
              disabled={!hasChanges}
            >
              <FiRefreshCw />
              Reset Changes
            </Button>
            <Button 
              className="primary" 
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <FiSave />
              Save Changes
            </Button>
          </ButtonGroup>
        </SettingsContent>
      </SettingsContainer>
    </div>
  );
}

export default Settings;
