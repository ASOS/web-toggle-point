"use client";
import { useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import featuresStore from "./featuresStore";

const { providerFactory } = featuresStore;

const Example = ({ children, experiments }) => {
  const searchParams = useSearchParams();
  const FeaturesProvider = providerFactory();
  return (
    <div className={styles.experiments}>
      {searchParams.has("showExperiments") ? (
        <code className={styles.code}>{JSON.stringify(experiments)}</code>
      ) : undefined}
      <FeaturesProvider value={experiments}>
        <div>{children}</div>
      </FeaturesProvider>
    </div>
  );
};

export default Example;
