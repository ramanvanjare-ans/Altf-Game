"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import Loader from "./Loader";

const ConversionResult = ({
  loading,
  convertedAmount,
  exchangeRate,
  fromCurrency,
  toCurrency,
}) => {
  return (
    <div className="p-6 rounded-2xl shadow-lg border border-(--border) bg-(--card) text-(--card-foreground) space-y-4 transition-colors">
      {/* Header */}
      <h2 className="text-lg font-semibold flex items-center text-(--primary)">
        <ArrowRight className="w-5 h-5 mr-2 text-(--primary)" />
        Conversion Result
      </h2>

      {/* Loader or Results */}
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {/* Converted Amount */}
          <div className="w-full">
            <p className="text-sm text-(--muted-foreground)">Total Converted</p>

            <div className="flex items-baseline flex-wrap max-w-full overflow-hidden">
              {/* Converted Value */}
              <span className="font-extrabold text-(--primary) drop-shadow-lg leading-none max-w-full truncate block text-3xl sm:text-3xl xs:text-2xl md:text-4xl">
                {convertedAmount !== null ? convertedAmount.toFixed(2) : "---"}
              </span>

              {/* Currency */}
              <span className="text-2xl sm:text-3xl md:text-3xl font-semibold ml-2 text-(--foreground)">
                {toCurrency}
              </span>
            </div>
          </div>

          {/* Exchange Rate */}
          {exchangeRate && (
            <div className="pt-4 border-t border-(--border)">
              <p className="text-sm font-medium text-(--primary)">
                Exchange Rate (1 {fromCurrency} → {toCurrency})
              </p>

              <p className="font-mono text-lg sm:text-xl text-(--foreground)">
                1 {fromCurrency} =
                <span className="text-(--primary) font-semibold">
                  {" "}
                  {exchangeRate.toFixed(6)}{" "}
                </span>
                {toCurrency}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversionResult;
