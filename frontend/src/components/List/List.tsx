import { BeerAnimation } from "../BeerAnimation/BeerAnimation";
import Button from "../BTN/Button";
import css from "./List.module.css";

export default function List() {
  const initData = Telegram.WebApp.initData;
  return (
    <div className={css.container}>
      <BeerAnimation />
      <Button />
    </div>
  );
}
