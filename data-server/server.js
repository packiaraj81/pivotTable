const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // To parse JSON payloads

const sampleData = [
  { team: "Team A", region: "North", country: "USA" },
  { team: "Team A", region: "North", country: "Canada" },
  { team: "Team B", region: "East", country: "UK" },
  { team: "Team B", region: "South", country: "Brazil" },
];

const group2Data = [
  { parentKey: "Team A-North-USA", sales: 500, profit: 300 },
  { parentKey: "Team A-North-Canada", sales: 400, profit: 200 },
  { parentKey: "Team B-East-UK", sales: 600, profit: 400 },
  { parentKey: "Team B-South-Brazil", sales: 700, profit: 500 },
];

const reportData = [
  {
    parentKey: "Team A-North-USA-500-300",
    detail1: "Detail A1",
    detail2: "A2",
    detail3: "Completed",
  },
  {
    parentKey: "Team A-North-USA-500-300",
    detail1: "Detail B1",
    detail2: "B2",
    detail3: "Pending",
  },
  {
    parentKey: "Team A-North-Canada-400-200",
    detail1: "Detail C1",
    detail2: "C2",
    detail3: "Completed",
  },
  {
    parentKey: "Team B-East-UK-600-400",
    detail1: "Detail D1",
    detail2: "D2",
    detail3: "Pending",
  },
  {
    parentKey: "Team B-South-Brazil-700-500",
    detail1: "Detail E1",
    detail2: "E2",
    detail3: "Completed",
  },
];

app.post("/api/data", (req, res) => {
  const payload = req.body;
  const { team, region, country, sales, profit } = payload;

  let data = [];

  if (!team && !region && !country && !sales && !profit) {
    // Return sampleData if no payload is provided
    data = sampleData;
  } else if (team && region && country && !sales && !profit) {
    data = group2Data.filter((item) =>
      item.parentKey.startsWith(`${team}-${region}-${country}`)
    );
  } else if (team && region && country && sales && profit) {
    data = reportData.filter((item) =>
      item.parentKey.startsWith(
        `${team}-${region}-${country}-${sales}-${profit}`
      )
    );
  }

  // Send the payload and result separately
  res.json({ payload, result: data });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
