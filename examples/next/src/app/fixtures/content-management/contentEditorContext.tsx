"use client";
import type { ReactNode } from "react";
import featuresStore from "./featuresStore";

const FeaturesProvider = featuresStore.providerFactory();

interface FeaturesProviderProps {
  children: ReactNode;
  isContentEditor: boolean;
}

export default ({ children, isContentEditor }: FeaturesProviderProps) => {
  return (
    <FeaturesProvider
      value={{ devMode: { status: isContentEditor ? "active" : "inactive" } }}
    >
      {children}
    </FeaturesProvider>
  );
};
