"use client";

import { useState } from "react";
import Header from "../components/Header";
import InputField from "../components/InputField";
import Button from "../components/Button";
import TotalDisplay from "../components/TotalDisplay";
// import HowItWorks from "../components/HowItWorks";
import { calculateTotal } from "../utils/calculateTotal";

export default function PricingCalculatorApp() {
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const handleCalculate = () => {
    setTotal(calculateTotal({ price, quantity, shipping, discount }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--background) text-(--foreground)">

      {/* HEADER */}
      <Header/>

      {/* MAIN CONTENT */}
      <main className="flex-1">

        {/* Calculator Section */}
        <section className="flex justify-center items-center pb-20 px-4">
          <div
            className="
              w-full max-w-lg
              bg-(--card)
              border border-(--border)
              p-8
              rounded-2xl
              shadow-sm
            "
          >
            <h2 className="subheading text-center mb-6">
              Calculate your Price
            </h2>

            <InputField
              label="Product Price (₹)"
              value={price}
              setValue={setPrice}
            />

            <InputField
              label="Quantity"
              value={quantity}
              setValue={setQuantity}
            />

            <InputField
              label="Shipping (₹)"
              value={shipping}
              setValue={setShipping}
            />

            <InputField
              label="Discount (%)"
              value={discount}
              setValue={setDiscount}
            />

            <div className="mt-6">
              <Button
                text="Calculate Total"
                onClick={handleCalculate}
              />
            </div>

            <TotalDisplay total={total} />
          </div>
        </section>

        {/* HOW IT WORKS */}
        {/* <HowItWorks/> */}

      </main>

    </div>
  );
}
