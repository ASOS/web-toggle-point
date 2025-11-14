import TopBox from "./components/TopBox";
import BottomBox from "./components/BottomBox";
import StateProvider from "./StateProvider";
import { getFeatures, setValue } from "./toggle-plumbing/featuresStore";
import "./styles.css";

export default function App() {
  return (
    <StateProvider>
      <select
        onChange={({ target: { value: selection } }) => setValue({ selection })}
        defaultValue={getFeatures().selection}
      >
        <option>baseline 🐶</option>
        <option value="feature1">feature 1 🐱</option>
        <option value="feature2">feature 2 🐹</option>
        <option value="feature3">feature 3 🐰</option>
        <option value="feature4">feature 4 🦀</option>
        <option value="feature5">feature 5 🪐</option>
      </select>
      <TopBox />
      <BottomBox />
    </StateProvider>
  );
}
