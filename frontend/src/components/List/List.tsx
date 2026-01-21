import { useEffect, useState } from "react";
import { BeerAnimation } from "../BeerAnimation/BeerAnimation";
import Button from "../BTN/Button";
import css from "./List.module.css";
import { api } from "../../lib/axios";
import { useTelegram } from "../../hook/telegram";
import type { ProductInterface } from "../../types/product.dto";

export default function List() {
  const { user, initData, isReady } = useTelegram();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductInterface | null>(null);

  useEffect(() => {
    if (!isReady) return;

    if (!initData) {
      setError("Please open this App in Telegram");
      setIsLoading(false);
      return;
    }

    async function initializeApp() {
      try {
        await api.post("/api/auth/telegram", {
          initData,
        });
        console.log("✅ Auth success");

        const response = await api.post("/api/product/create", {
          name: "beer",
          priceTon: 10,
        });

        setProduct(response.data);
        setIsLoading(false);
      } catch (err: any) {
        console.error("❌ Error:", err);
        setError(err.response?.data?.message || "Authentication failed");
        setIsLoading(false); // ✅ false, не true
      }
    }

    initializeApp();
  }, [isReady, initData]);

  if (error) {
    return (
      <div className={css.container}>
        <BeerAnimation />
        <div style={{ color: "red" }}>{error}</div>
      </div>
    );
  }

  if (!isReady || isLoading || !product) {
    return (
      <div className={css.container}>
        <BeerAnimation />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <BeerAnimation />
      {user && (
        <div>
          <h2>Welcome, {user.first_name || user.username}! 🍺</h2>
          <p>Telegram ID: {user.id}</p>
          {user.username && <p>@{user.username}</p>}
        </div>
      )}
      <Button id={user.id} product={product} />
    </div>
  );
}
