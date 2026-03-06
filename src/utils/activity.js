export function saveDailyActivity(data) {

  const existing = JSON.parse(localStorage.getItem("activity") || "[]");

  const alreadyExists = existing.find(d => d.date === data.date);

  if (!alreadyExists) {
    existing.push(data);
  }

  localStorage.setItem("activity", JSON.stringify(existing));
}

export function getActivity() {
  return JSON.parse(localStorage.getItem("activity") || "[]");
}