"use client";
import React from "react";
import { ArrowRightLeft, TrendingUp } from "lucide-react";
import CurrencySelect from "../components/CurrencySelect";
import ConversionResult from "../components/ConversionResult";
import { useCurrencyConverter } from "../hooks/useCurrencyConverter";
// import Header from "../components/Header";

const CurrencyConverter = () => {
  const {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    rates,
    convertedAmount,
    exchangeRate,
    loading,
    error,
  } = useCurrencyConverter();

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)  overflow-x-hidden ">
      {/* <Header /> */}{" "}
      <div className="flex items-center justify-center flex-col">
        <h1 className="heading mt-5">
          <TrendingUp className="inline w-7 h-7 mr-2 text-[#3b82f6]" />
          Currency Converter
        </h1>
        <p className="description">Real-time exchange rates .</p>
      </div>
      <div className="flex items-center justify-center m-1 mt-10 ">
        <div className="relative w-full max-w-3xl rounded-3xl p-10 shadow-2xl">
          {/* Decorative gradients */}

          <div className="absolute -top-12.5 -left-12.5 w-40 h-40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12.5 -right-12.5 w-60 h-60 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {error && (
              <div className="mb-4 p-3 bg-red-800/50 text-red-300 border border-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Amount Input */}
            <label className="text-sm font-medium text-(--foreground) ">
              Amount
            </label>
            <div className="relative mb-6">
              {/* Glow */}
              <div className="absolute -bottom-10 -right-10 w-48 h-32 rounded-full blur-3xl"></div>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="relative z-10 w-full bg-(--card) text-(--foreground) text-2xl sm:text-3xl font-bold border border-(--border) py-3 px-4 rounded-xl shadow-lg focus:ring-2 focus:ring-(--primary) focus:outline-none transition-all"
              />
            </div>

            {/* Selector Row */}
            <div className="flex items-center space-x-4 mb-8">
              <CurrencySelect
                label="From"
                value={fromCurrency}
                rates={rates}
                loading={loading}
                onChange={(e) => setFromCurrency(e.target.value)}
              />

              <button
                onClick={handleSwap}
                className="mt-6 p-3 bg-blue-500 hover:bg-green-400 text-(--foreground) rounded-full cursor-pointer"
              >
                <ArrowRightLeft size={18} />
              </button>

              <CurrencySelect
                label="To"
                value={toCurrency}
                rates={rates}
                loading={loading}
                onChange={(e) => setToCurrency(e.target.value)}
              />
            </div>

            {/* Result Card */}
            <ConversionResult
              loading={loading}
              convertedAmount={convertedAmount}
              exchangeRate={exchangeRate}
              amount={amount}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 "></div>
      {/* footer */}
    </div>
  );
};

export default CurrencyConverter;
