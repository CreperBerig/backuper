import { createContext, useContext, useState, type ReactNode } from "react";

interface FooterState {
  changesCount: number;
  isDisabled: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

interface SettingsFooterContextType extends FooterState {
  setFooter: (state: Partial<FooterState>) => void;
}

const defaultFooter: FooterState = {
  changesCount: 0,
  isDisabled: true,
  onSubmit: () => {},
  onCancel: () => {},
};

const SettingsFooterContext = createContext<SettingsFooterContextType | null>(null);

export function SettingsFooterProvider({ children }: { children: ReactNode }) {
  const [footer, setFooterState] = useState<FooterState>(defaultFooter);

  const setFooter = (state: Partial<FooterState>) =>
    setFooterState((prev) => ({ ...prev, ...state }));

  return (
    <SettingsFooterContext.Provider value={{ ...footer, setFooter }}>
      {children}
    </SettingsFooterContext.Provider>
  );
}

export function useSettingsFooter() {
  const ctx = useContext(SettingsFooterContext);
  if (!ctx) throw new Error("useSettingsFooter must be used within SettingsFooterProvider");
  return ctx;
}
