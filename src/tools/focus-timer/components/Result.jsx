export default function Result({ data }) {
  if (!data) return null;

  return (
    <div className="subheading ">
      <p>Total Working Time: {data.totalMinutes} minutes</p>
      <p>Focus Session Length: {data.focusTime} minutes</p>
      <p>Break Time: {data.breakTime} minutes</p>
      <p>Total Focus Sessions: {data.focusSessions}</p>
      <p><strong>Remaining Time: {data.remainingTime} minutes</strong></p>
    </div>
  );
}
