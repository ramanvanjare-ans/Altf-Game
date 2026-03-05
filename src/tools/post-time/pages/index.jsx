import BestTimeCalculator from "../components/BestTimeCalculator";
import Header from "../components/Header";


export default function ToolHome() {
  return (
    <div className="min-h-screen bg-(--background) transition px-4 py-8">
      <Header />
      <BestTimeCalculator />
      
    </div>
  );
}


