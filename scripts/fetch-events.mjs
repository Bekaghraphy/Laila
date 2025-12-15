import fs from "fs";

const events = [
  {
    title: "European Rhythmic Gymnastics Championships",
    city: "Budapest",
    country: "Hungary",
    startDate: "2025-05-22",
    endDate: "2025-05-26",
    federation: "European Gymnastics",
    link: "https://www.europeangymnastics.com"
  },
  {
    title: "World Cup Sofia",
    city: "Sofia",
    country: "Bulgaria",
    startDate: "2025-04-12",
    endDate: "2025-04-14",
    federation: "FIG",
    link: "https://www.gymnastics.sport"
  }
];

const output = {
  updatedAt: new Date().toISOString(),
  events
};

fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/events.json", JSON.stringify(output, null, 2));

console.log("Events updated");
