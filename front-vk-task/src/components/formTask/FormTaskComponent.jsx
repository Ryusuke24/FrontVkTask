import useDebounce from "../../hooks/useDebounce.js";
import style from "./FormTaskComponent.module.css";
import { useEffect, useState } from "react";

export const FormTaskComponent = () => {
  const [cache, setCache] = useState({});
  const [error, setError] = useState(null);
  const [data, setData] = useState("");
  const [inputText, setInputText] = useState("");
  const debouncedSearchQuery = useDebounce(inputText, 3000);

  const controller = new AbortController();
  const signal = controller.signal;

  function getFilteredUser(value) {
    if (value in cache) {
      setData(cache[value]);
    } else {
      setError(null);
      if (!value.match(/[A-Za-z]+/g)) {
        setError("Введите только буквы");
      } else {
        return fetch(`https://api.agify.io/?name=${value}`, { signal })
          .then(res => {
            if (!res.ok) {
              throw new Error("Failed to fetch");
            }
            return res.json();
          })
          .then(data => {
            setData(data);
            const clonedCache = cache;
            clonedCache[data.name] = data;
            setCache(clonedCache);
          })
          .catch(e => setError(e.message));
      }
    }
  }

  useEffect(() => {
    if (debouncedSearchQuery !== "") {
      getFilteredUser(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const onSubmit = async (e, value) => {
    e.preventDefault();
    if (value in cache) {
      setData(cache[value]);
    } else {
      setError(null);
      console.log("Дебаунсинг запрос отменен");
      controller.abort();
      if (!value.match(/[A-Za-z]+/g) || value === "") {
        setError("Введите только буквы");
      } else {
        try {
          const res = await fetch(`https://api.agify.io/?name=${value}`);
          if (!res.ok) {
            throw new Error("Failed to fetch");
          }
          const data = await res.json();

          setData(data);

          const clonedCache = cache;
          clonedCache[data.name] = data;
          setCache(clonedCache);
        } catch (e) {
          setError(e.message);
        }
      }
    }
  };
  console.log(cache);
  return (
    <div className={style.formTask}>
      {" "}
      <form onSubmit={e => onSubmit(e, inputText)}>
        <label>Введите имя:</label>
        <input
          value={inputText}
          onChange={e => {
            setInputText(e.target.value);
          }}
        />
        <button type="submit">Submit</button> <br />
      </form>{" "}
      <br />
      {error ? (
        <p className={style.answer}>{error}</p>
      ) : (
        data && (
          <div className={style.answer}>
            <p>Age : {data.age}</p>
          </div>
        )
      )}
    </div>
  );
};
