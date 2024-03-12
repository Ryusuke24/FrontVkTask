import useDebounce from "../../hooks/useDebounce.js";
import style from "./FormTaskComponent.module.css";
import { useEffect, useState } from "react";

export const FormTaskComponent = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState("");
  const [inputText, setInputText] = useState("");
  const debouncedSearchQuery = useDebounce(inputText, 3000);

  const controller = new AbortController();
  const signal = controller.signal;

  function getFilteredUser(value) {
    setError(null);
    if (value.match(/\d+/g) || value === "") {
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
        })
        .catch(e => setError(e.message));
    }
  }

  useEffect(() => {
    getFilteredUser(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const onSubmit = async (e, value) => {
    e.preventDefault();

    setError(null);
    console.log("Дебаунсинг запрос отменен");
    controller.abort();
    if (value.match(/\d+/g) || value === "") {
      setError("Введите только буквы");
    } else {
      try {
        const res = await fetch(`https://api.agify.io/?name=${value}`);
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();

        setData(data);
      } catch (e) {
        setError(e.message);
      }
    }
  };

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
            <ul>
              <li>Id : {data.count}</li>
              <li>Name : {data.name}</li>
              <li>Age : {data.age}</li>
            </ul>
          </div>
        )
      )}
    </div>
  );
};
