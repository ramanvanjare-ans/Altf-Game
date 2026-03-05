import { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Result from "../components/Result";
import FocusTimer from "../components/FocusTimer";
import FocusForm from "../components/FocusForm";
import Quote from "../components/Quote";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
     
      <Header />

 
      <main className="flex-1 w-full mx-auto py-9 px-6">
     
        {/* <Hero /> */}

    
        <section className="bg-(--card) p-8 rounded-xl ">
          <h2 className="subheading">Focus Time Calculator</h2>

        
          <FocusForm onResult={setResult} />

         
          <Result data={result} />
        </section>

       
        {/* <section className="bg-(--card) p-8 rounded-xl ]">
          <h2>Why Focus Is Important</h2>
          <p>
            Focused work helps you complete tasks efficiently while reducing
            mental fatigue. Structured focus sessions improve productivity and
            prevent burnout.Focus is the foundation of effective time management. Without clear focus periods, work often stretches longer than expected and feels more exhausting than it should. When you dedicate specific blocks of time to focused work, you reduce distractions and use your available time more intentionally.

Understanding how much focused time you can realistically handle helps prevent overplanning. Instead of filling your day with unrealistic goals, focused sessions allow you to work smarter, stay energized, and maintain consistency throughout the day.
          </p>
        </section> */}

       
        <section className="bg-(--card) p-8 rounded-xl ">
          {/* <h2 className="subheading">Focus Timer</h2> */}
          <FocusTimer />
        </section>

        {/* CONTENT SECTION 2 */}
        <section className="bg-(--card) p-8 rounded-xl ">
          <h2>How This Tool Helps You</h2>
          <p>
            This calculator instantly shows how much focused work you can do
            within your available time. Results update in real time as you
            change inputs.This Focus Time Calculator helps you plan your day by showing exactly how much deep work you can fit into your available time. By factoring in session length and breaks, it removes guesswork and gives you a clear, realistic focus plan.

As you change inputs, the results update instantly, allowing you to experiment with different schedules. This makes it easier to balance productivity with rest, ensuring you stay focused without feeling overwhelmed.
          </p>
        </section>

        {/* QUOTE */}
        <Quote />

        {/* CONTENT SECTION 3 */}
        <section className="bg-(--card) p-8 rounded-xl ">
          <h2>Build Better Habits</h2>
          <p>
            Consistent focus sessions lead to better habits. Over time, your
            ability to concentrate improves.Using a focus time calculator regularly helps you develop awareness of your working capacity. When you know your limits, you’re more likely to stick to schedules that are sustainable rather than exhausting.

Over time, planning your focus sessions becomes a habit. You start structuring your day around achievable focus blocks, improving discipline and consistency. These small, planned sessions add up, leading to better productivity and long-term improvement in how you manage your time.
          </p>
        </section>
      </main>

     
    </div>
  );
}
