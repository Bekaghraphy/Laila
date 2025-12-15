import fs from "fs";

const events = [
  {
    title: "European Rhythmic Gymnastics Championships",
    startDate: "2025-05-22",
    endDate: "2025-05-26",
    city: "Budapest",
    country: "Hungary",
    source: "European Gymnastics",
    url: "https://www.europeangymnastics.com"
  },
  {
    title: "FIG World Cup Sofia",
    startDate: "2025-04-12",
    endDate: "2025-04-14",
    city: "Sofia",
    country: "Bulgaria",
    source: "FIG",
    url: "https://www.gymnastics.sport"
  }
];

const output = {
  updatedAt: new Date().toISOString(),
  events
};

fs.writeFileSync("data/events.json", JSON.stringify(output, null, 2));
console.log("Events updated:", events.length);
