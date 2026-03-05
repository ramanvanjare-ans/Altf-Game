"use client";
import { useEffect, useState, useCallback } from "react";
import { API_URL } from "../constants/currencies";
import { calculateRate } from "../utils/calculateRate";

export const useCurrencyConverter = () => {
  const [amount, setAmount] = useState(1.0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [rates, setRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.rates) {
          throw new Error("Unable to fetch live data");
        }

        setRates(data.rates);
        setError("");
      } catch (err) {
        setError(err.message);

        // fallback dummy rates
        setRates({
          USD: 1,
          EUR: 0.92,
          GBP: 0.79,
          JPY: 154.5,
          CAD: 1.37,
          INR: 83.5,
          AUD: 1.5,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Convert logic
  const convert = useCallback(() => {
    // If input is empty → reset result
    if (amount === "") {
      setConvertedAmount(null);
      setExchangeRate(null);
      return;
    }
    if (!rates || !amount) return;

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setConvertedAmount(null);
      setExchangeRate(null);
      return;
    }

    const { finalRate, result } = calculateRate(
      rates,
      fromCurrency,
      toCurrency,
      numericAmount
    );

    setExchangeRate(finalRate);
    setConvertedAmount(result);
  }, [amount, fromCurrency, toCurrency, rates]);

  useEffect(() => {
    const timer = setTimeout(() => convert(), 300);
    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency, convert]);

  return {
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
  };
};
