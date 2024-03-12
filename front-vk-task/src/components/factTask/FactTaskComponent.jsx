import { useEffect, useRef, useState } from "react";
import style from "./FactTaskComponent.module.css";

export const FactTaskComponent = () => {
  const [fact, setFact] = useState("no fact now");
  const ref = useRef(null);

  async function handleClick() {
    const res = await fetch("https://catfact.ninja/fact");
    const data = await res.json();
    setFact(data.fact);
  }

  useEffect(() => {
    const string = ref.current.value;
    let index = string.indexOf(" ");
    ref.current.setSelectionRange(index, index);
    ref.current.focus();
  }, [fact]);

  return (
    <div className={style.factTask}>
      <textarea
        className={style.textField}
        value={fact}
        ref={ref}
        onChange={e => setFact(e.target.value)}
      />
      <button onClick={handleClick}>Получить факт</button>
    </div>
  );
};
