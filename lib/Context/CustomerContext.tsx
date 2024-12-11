'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  // Add other relevant fields
};

type CustomerContextType = {
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
};

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  return (
    <CustomerContext.Provider value={{ customerInfo, setCustomerInfo }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}
