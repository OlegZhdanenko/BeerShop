import { useState, useEffect } from "react";
import { api } from "../../lib/axios";
import css from "./Button.module.css";
import clsx from "clsx";
import { tonConnect } from "../../lib/ton";

const BUY_ADDRESS = "0QCD_898l4IiP8pg2b13cIKn8bd8IoPI_VOFU3SmA1cKjpFj";

interface IProduct {
  id: number;
  name: string;
  priceTon: number;
}

interface IButton {
  id: number;
  product: IProduct;
}

export default function Button({ id, product }: IButton) {
  const [orderId, setOrderId] = useState<number | null>(null);
  const [status, setStatus] = useState<"PENDING" | "PAID" | "FAILED" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const buy = async () => {
    setIsLoading(true);

    try {
      if (!tonConnect.connected) {
        await tonConnect.connectWallet();
        setIsLoading(false);
        return;
      }

      const { data } = await api.post("/api/order/create", {
        userId: id,
        productId: product.id,
      });

      setOrderId(data.orderId);
      setStatus("PENDING");

      await tonConnect.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: BUY_ADDRESS,
            amount: (product.priceTon * 1e9).toString(),
          },
        ],
      });
    } catch (err) {
      console.error(err);
      setStatus("FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/api/order/${orderId}`);
        if (res.data.status === "PAID" || res.data.status === "FAILED") {
          setStatus(res.data.status);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <>
      {!tonConnect.connected ? (
        <button className={clsx(css.beerBtn)} onClick={() => buy}>
          Connect Wallet
        </button>
      ) : (
        <button
          className={clsx(css.beerBtn)}
          onClick={buy}
          disabled={isLoading || status === "PAID"}
        >
          <span className={css.foam}></span>
          <span className={css.label}>
            {status === "PAID"
              ? "Paid!"
              : isLoading
              ? "Processing..."
              : "Buy me!!!"}
          </span>
          <span className={clsx(css.bubble, css.b1)}></span>
          <span className={clsx(css.bubble, css.b2)}></span>
          <span className={clsx(css.bubble, css.b3)}></span>
        </button>
      )}
    </>
  );
}
