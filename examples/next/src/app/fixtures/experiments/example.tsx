"use client";
import { useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import featuresStore from "./featuresStore";

const { providerFactory } = featuresStore;
const FeaturesProvider = providerFactory();

const Example = ({ children, experiments }) => {
  const searchParams = useSearchParams();
  return (
    <div
      className={`${styles.experiments} ${
        searchParams.get("showExperiments") ? styles.debug : ""
      }`}
    >
      <FeaturesProvider value={experiments}>
        <div>{children}</div>
      </FeaturesProvider>
    </div>
  );
};

export default Example;
