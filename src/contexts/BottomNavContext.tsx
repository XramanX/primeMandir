import React, { createContext, useContext, useState } from 'react';

type BottomNavContextType = {
  visible: boolean;
  setVisible: (v: boolean) => void;
};

const BottomNavContext = createContext<BottomNavContextType | undefined>(
  undefined,
);

export const BottomNavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(true);
  return (
    <BottomNavContext.Provider value={{ visible, setVisible }}>
      {children}
    </BottomNavContext.Provider>
  );
};

export function useBottomNav() {
  const ctx = useContext(BottomNavContext);
  if (!ctx)
    throw new Error('useBottomNav must be used within BottomNavProvider');
  return ctx;
}
