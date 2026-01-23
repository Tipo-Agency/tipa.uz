import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextType {
  isOpen: boolean;
  sourceSection?: string; // Секция откуда открыта форма
  openModal: (sourceSection?: string) => void;
  closeModal: () => void;
  // Попап "Спасибо"
  isThankYouOpen: boolean;
  openThankYou: () => void;
  closeThankYou: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceSection, setSourceSection] = useState<string | undefined>(undefined);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);

  const openModal = (section?: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔓 openModal called with section:', section);
    }
    setSourceSection(section);
    setIsOpen(true);
  };
  
  const closeModal = () => {
    setIsOpen(false);
    setSourceSection(undefined);
  };

  const openThankYou = () => {
    setIsThankYouOpen(true);
  };

  const closeThankYou = () => {
    setIsThankYouOpen(false);
  };

  return (
    <ModalContext.Provider value={{ 
      isOpen, 
      sourceSection, 
      openModal, 
      closeModal,
      isThankYouOpen,
      openThankYou,
      closeThankYou
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};