import css from "./Button.module.css";
import clsx from "clsx";
export default function Button() {
  function handlClick() {
    console.log("click");
  }
  return (
    <button className={clsx(css.beerBtn)} onClick={handlClick}>
      <span className={css.foam}></span>
      <span className={css.label}>Buy me!!!</span>

      <span className={clsx(css.bubble, css.b1)}></span>
      <span className={clsx(css.bubble, css.b2)}></span>
      <span className={clsx(css.bubble, css.b3)}></span>
    </button>
  );
}
