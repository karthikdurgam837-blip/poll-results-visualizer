export interface PollResponse {
  id: string;
  timestamp: string;
  ageGroup: string;
  gender: string;
  region: string;
  preferredTool: string;
  satisfaction: number;
  feedback: string;
}

const TOOLS = ["Python", "JavaScript", "TypeScript", "React", "Rust", "Go"];
const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];
const GENDERS = ["Male", "Female", "Non-binary", "Other"];
const REGIONS = ["North", "South", "East", "West"];
const FEEDBACK_SAMPLES = [
  "Love the performance of this tool!",
  "A bit difficult to learn at first.",
  "Excellent documentation and community support.",
  "Integration was somewhat clunky.",
  "Highly recommend for enterprise projects.",
  "The syntax is very clean.",
  "Too many breaking changes in recent versions.",
  "Great for data science and analysis.",
  "The learning curve is steep but worth it.",
  "Perfect for web development."
];

export function generateSyntheticData(count: number = 100): PollResponse[] {
  const data: PollResponse[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000);
    data.push({
      id: `RES-${Math.floor(Math.random() * 900000) + 100000}`,
      timestamp: date.toISOString(),
      ageGroup: AGE_GROUPS[Math.floor(Math.random() * AGE_GROUPS.length)],
      gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
      region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
      preferredTool: TOOLS[Math.floor(Math.random() * TOOLS.length)],
      satisfaction: Math.floor(Math.random() * 5) + 1,
      feedback: FEEDBACK_SAMPLES[Math.floor(Math.random() * FEEDBACK_SAMPLES.length)]
    });
  }
  return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function processPollData(data: PollResponse[]) {
  // Aggregate by Tool
  const toolCounts = data.reduce((acc, curr) => {
    acc[curr.preferredTool] = (acc[curr.preferredTool] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const toolChartData = Object.entries(toolCounts).map(([name, value]) => ({ name, value }));

  // Aggregate by Region
  const regionCounts = data.reduce((acc, curr) => {
    acc[curr.region] = (acc[curr.region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regionChartData = Object.entries(regionCounts).map(([name, value]) => ({ name, value }));

  // Satisfaction Distribution
  const satisfactionCounts = data.reduce((acc, curr) => {
    acc[curr.satisfaction] = (acc[curr.satisfaction] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const satisfactionChartData = [1, 2, 3, 4, 5].map(rating => ({
    rating: `Rating ${rating}`,
    count: satisfactionCounts[rating] || 0
  }));

  // Daily Trend
  const dailyCounts = data.reduce((acc, curr) => {
    const date = curr.timestamp.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const trendChartData = Object.entries(dailyCounts).map(([date, count]) => ({ 
    date, 
    count 
  })).sort((a, b) => a.date.localeCompare(b.date));

  // Radar Data for Comparative Performance (Tool-wise metrics)
  const radarData = TOOLS.map(tool => {
    const toolData = data.filter(d => d.preferredTool === tool);
    const avgSat = toolData.length ? toolData.reduce((p, c) => p + c.satisfaction, 0) / toolData.length : 0;
    return {
      subject: tool,
      A: avgSat * 20, // Scale 1-5 to 0-100
      B: (toolData.length / data.length) * 400, // Popularity metric
      fullMark: 100,
    };
  });

  // Cross-Demographic (Stacked Bar: Age Group vs Tool)
  const ageGroupToolData = AGE_GROUPS.map(age => {
    const ageData = data.filter(d => d.ageGroup === age);
    const counts = TOOLS.reduce((acc, tool) => {
      acc[tool] = ageData.filter(d => d.preferredTool === tool).length;
      return acc;
    }, {} as Record<string, number>);
    return {
      age,
      ...counts
    };
  });

  return {
    toolChartData,
    regionChartData,
    satisfactionChartData,
    trendChartData,
    radarData,
    ageGroupToolData,
    totalResponses: data.length,
    avgSatisfaction: data.length ? (data.reduce((a, b) => a + b.satisfaction, 0) / data.length).toFixed(1) : "0"
  };
}
