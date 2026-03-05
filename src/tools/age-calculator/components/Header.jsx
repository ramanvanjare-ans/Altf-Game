import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-(--background) text-(--primary) p-6 text-center"
    >
      <h1 className="heading  flex justify-center gap-2  animate-fade-up ">
          Age Calculator
      </h1>
      <p className=" description opacity-90 mt-1 text-(--secondary)  animate-fade-up">
        Discover your exact age down to the second
      </p>
    </motion.div>
  );
}
