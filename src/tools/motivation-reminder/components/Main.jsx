"use client";


import { useState, useEffect } from "react";
import {
  Bell,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Check,
  X,
  Calendar,
} from "lucide-react";
import ToolChip from "@/shared/ui/ToolChip";

export default function Main() {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    time: "09:00",
    message: "",
    enabled: true,
  });
  const [notificationPermission, setNotificationPermission] =
    useState("default");

  // Load reminders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("motivationReminders");
    if (saved) {
      setReminders(JSON.parse(saved));
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Save reminders to localStorage
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem("motivationReminders", JSON.stringify(reminders));
    }
  }, [reminders]);

  // Check reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      reminders.forEach((reminder) => {
        if (reminder.enabled && reminder.time === currentTime) {
          if (reminder.lastTriggered !== currentTime) {
            showNotification(reminder.message);
            // Update last triggered time
            setReminders((prev) =>
              prev.map((r) =>
                r.id === reminder.id ? { ...r, lastTriggered: currentTime } : r
              )
            );
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [reminders]);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        showNotification("Great! You'll now receive motivation reminders.");
      }
    }
  };

  const showNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("💪 Motivation Reminder", {
        body: message,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>✨</text></svg>",
        badge:
          "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>💪</text></svg>",
        tag: "motivation-reminder",
        requireInteraction: false,
      });
    }
  };

  const addReminder = () => {
    if (!newReminder.message.trim()) {
      alert("Please enter a motivation message!");
      return;
    }

    const reminder = {
      id: Date.now(),
      time: newReminder.time,
      message: newReminder.message,
      enabled: true,
      lastTriggered: null,
    };

    setReminders([...reminders, reminder]);
    setNewReminder({ time: "09:00", message: "", enabled: true });
    setShowAddForm(false);
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const toggleReminder = (id) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const motivationalQuotes = [
    "Believe you can and you're halfway there.",
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "You are never too old to set another goal or to dream a new dream.",
    "The only impossible journey is the one you never begin.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
  ];

  const useQuote = (quote) => {
    setNewReminder({ ...newReminder, message: quote });
  };

  const testNotification = () => {
    if (Notification.permission === "granted") {
      showNotification(
        "This is a test notification! Your reminders will look like this."
      );
    } else {
      alert("Please enable notifications first!");
    }
  };

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-16 bg-(--background)  text-(--foreground)">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <ToolChip text="Motivation Reminder" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-(--foreground) mb-6 leading-tight">
          Stay Motivated
          <br />
          <span className="bg-(--primary) bg-clip-text text-transparent">
            Every Day
          </span>
        </h1>
        <p className="text-(--foreground) text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
          Schedule daily motivation reminders to keep you inspired and focused
          on your goals.
        </p>
      </div>

      {/* Notification Permission */}
      {notificationPermission !== "granted" && (
        <div className="bg-(--background) text-(--foreground)  border border(--border) rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-start gap-4">
            <Bell className="w-8 h-8 shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Enable Notifications</h3>
              <p className="mb-4 text-(--foreground)">
                Allow notifications to receive your daily motivation reminders
                at scheduled times.
              </p>
              <button
                onClick={requestNotificationPermission}
                className="bg-(--background )text-(--foreground) font-semibold px-6 py-2 rounded-lg hover:bg-purple-50 transition-all shadow-lg"
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reminder Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Your Reminders</h2>
        <div className="flex gap-3">
          {notificationPermission === "granted" && (
            <button
              onClick={testNotification}
              className="bg-muted hover:bg-muted text-foreground font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm"
            >
              <Bell className="w-4 h-4" />
              Test
            </button>
          )}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className=" bg-(--primary) text-white font-semibold px-6 py-2 rounded-lg transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Reminder
          </button>
        </div>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="bg-background rounded-2xl shadow-xl border border-purple-100 p-6 mb-6">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Create New Reminder
          </h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-foreground font-semibold mb-2">
                Time
              </label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, time: e.target.value })
                }
                className="w-full bg-muted border border-border text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-2">
                Motivation Message
              </label>
              <textarea
                value={newReminder.message}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, message: e.target.value })
                }
                placeholder="Enter your motivation message..."
                className="w-full h-24 bg-muted border border-border text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
              />
            </div>

            {/* Quick Quotes */}
            <div>
              <label className="block text-(--foreground) bg-(--background) font-semibold mb-2">
                Or Choose a Quote
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {motivationalQuotes.map((quote, index) => (
                  <button
                    key={index}
                    onClick={() => useQuote(quote)}
                    className="bg-(--background) text-(--foreground) text-left px-3 py-2 rounded-lg text-sm transition-all border border-purple-100"
                  >
                    "{quote.substring(0, 40)}..."
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={addReminder}
              className="flex-1 bg-(--primary) text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              Save Reminder
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="border border-red-500 text-red-500 font-semibold px-6 py-3 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="bg-background rounded-2xl shadow-xl border border-purple-100 p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Reminders Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first motivation reminder to get started!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-(--primary) text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Reminder
            </button>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`bg-background rounded-2xl shadow-lg border-2 p-6 transition-all ${
                reminder.enabled
                  ? "border-purple-200 hover:shadow-xl"
                  : "border border-border opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    reminder.enabled
                      ? "bg-gradient-to-br from-purple-100 to-pink-100"
                      : "bg-muted"
                  }`}
                >
                  <Clock
                    className={`w-6 h-6 ${
                      reminder.enabled
                        ? "text-purple-600"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {reminder.time}
                      </p>
                      {reminder.enabled && (
                        <p className="text-xs text-green-600 font-medium">
                          Active
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          reminder.enabled
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {reminder.enabled ? "ON" : "OFF"}
                      </button>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {reminder.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-background rounded-xl border border-purple-100 p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-foreground mb-2">Smart Reminders</h3>
          <p className="text-sm text-muted-foreground">
            Receive notifications at your scheduled times
          </p>
        </div>
        <div className="bg-background rounded-xl border border-purple-100 p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="font-bold text-foreground mb-2">Custom Messages</h3>
          <p className="text-sm text-muted-foreground">
            Create your own motivational messages
          </p>
        </div>
        <div className="bg-background rounded-xl border border-purple-100 p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-foreground mb-2">Daily Routine</h3>
          <p className="text-sm text-muted-foreground">
            Build consistent motivation habits
          </p>
        </div>
      </div>
    </main>
  );
}
