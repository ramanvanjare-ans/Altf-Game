"use client";

import React, { useState } from "react";
import { Heart, Lightbulb, MessageCircle, Mail, Sparkles } from "lucide-react";

const Main = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const advices = [
    "Communication is key in any relationship. Express your feelings honestly and listen actively.",
    "Trust is the foundation of a strong relationship. Be consistent and reliable.",
    "Quality time matters more than quantity. Dedicate uninterrupted moments.",
    "Respect individuality. Allow space for growth and personal interests.",
    "Handle conflicts constructively. Focus on resolution, not winning.",
    "Express appreciation regularly. Small gestures strengthen bonds.",
    "Be patient. Relationships require time and effort.",
    "Maintain your identity. Two whole individuals create a healthy bond.",
    "Practice forgiveness. It promotes healing and closeness.",
    "Keep intimacy alive. Emotional and physical connection matters.",
  ];

  const tips = [
    "Always communicate openly and honestly.",
    "Respect personal space and individuality.",
    "Celebrate small moments together.",
    "Resolve conflicts before sleeping.",
    "Show appreciation daily.",
    "Support each other's dreams.",
    "Maintain trust consistently.",
    "Share responsibilities equally.",
    "Keep dating each other.",
    "Learn to compromise.",
  ];

  const handleAdvice = () => {
    const random = advices[Math.floor(Math.random() * advices.length)];
    setAnswer(random);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="space-y-8 p-5">
      {/* Header */}
      <div className="p-6 ">
        <div className="flex justify-center items-center gap-2 mb-2 flex-col">
          {/* <Heart className="w-5 h-5 text-(--primary)" /> */}
          <h2 className="heading">Relationship Adviser</h2>

          <p className="description">
            Get personalized advice and practical tips to strengthen your
            relationships.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: "home", label: "Home", icon: Sparkles },
          { key: "advice", label: "Get Advice", icon: Lightbulb },
          { key: "tips", label: "Tips", icon: MessageCircle },
          { key: "contact", label: "Contact", icon: Mail },
        ].map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition cursor-pointer
                ${
                  active
                    ? "bg-(--primary) text-(--primary-foreground)"
                    : "bg-(--card) text-(--foreground) border-(--border) hover:border-(--primary)"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Home */}
      {activeTab === "home" && (
        <div className="p-6 rounded-2xl bg-(--card) border border-(--border)">
          <h3 className="subheading mb-4">Welcome to LoveWise</h3>
          <p className="description mb-6">
            Your personal relationship advisor. Get guidance to improve
            communication, trust, and emotional connection.
          </p>
          <button
            onClick={() => setActiveTab("advice")}
            className="px-6 py-2 rounded-xl bg-(--primary) text-(--primary-foreground) cursor-pointer"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Advice */}
      {activeTab === "advice" && (
        <div className="p-6 rounded-2xl bg-(--card) border border-(--border) space-y-5">
          <h3 className="subheading">Ask Your Question</h3>
          <textarea
            placeholder="Write your relationship question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full min-h-35 p-4 rounded-xl border border-(--border) bg-(--background) text-(--foreground)"
          />
          <button
            onClick={handleAdvice}
            disabled={!question.trim()}
            className="px-6 py-2 rounded-xl bg-(--primary) text-(--primary-foreground) disabled:opacity-60 cursor-pointer"
          >
            Get Advice
          </button>

          {answer && (
            <div className="p-4 rounded-xl bg-(--background) border border-(--border)">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-(--primary)" />
                <span className="font-semibold text-(--foreground)">
                  Personalized Advice
                </span>
              </div>
              <p className="text-(--foreground)">{answer}</p>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      {activeTab === "tips" && (
        <div className="p-6 rounded-2xl bg-(--card) border border-(--border)">
          <h3 className="subheading mb-4">Relationship Tips</h3>
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-(--foreground)">
                <span className="text-(--primary)">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contact */}
      {activeTab === "contact" && (
        <div className="p-6 rounded-2xl bg-(--card) border border-(--border)">
          <h3 className="subheading mb-4">Contact Us</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-(--border) bg-(--background) text-(--foreground)"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-(--border) bg-(--background) text-(--foreground)"
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full min-h-30 p-3 rounded-xl border border-(--border) bg-(--background) text-(--foreground)"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-(--primary) text-(--primary-foreground) cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-2xl bg-(--card) border border-(--border)">
          <h4 className="font-semibold text-(--foreground) mb-2">
            Why Seek Relationship Advice?
          </h4>
          <p className="description">
            Relationships require continuous effort and understanding. Guidance
            can help improve communication and emotional clarity.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-(--card) border border-(--border)">
          <h4 className="font-semibold text-(--foreground) mb-2">
            Our Approach
          </h4>
          <p className="description">
            We provide practical, thoughtful advice focused on healthy
            communication and mutual respect.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
