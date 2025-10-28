import styles from "./index.module.css";

const AnimalPen = ({ animals }) => {
  return animals.length ? (
    <div className={styles.animalPen}>{animals}</div>
  ) : null;
};

export default AnimalPen;
