'use server';

export type ServerActionResult = {
  success: true;
  data: {
    aqi: number;
    city: string;
    recommendation: string;
  };
} | {
  success: false;
  error: string;
}

export async function getAirQuality(city: string): Promise<ServerActionResult> {
  try {
    const token = process.env.WAQI_TOKEN;
    if (!token) {
      // This is a server-side check, so we can throw an error.
      throw new Error("WAQI API token is not configured.");
    }
    
    const response = await fetch(`https://api.waqi.info/feed/${city}/?token=${token}`);
    const data = await response.json();

    if (data.status === "ok") {
      const aqi = data.data.aqi;
      let recommendation;
      if (aqi > 150) {
        recommendation = `The air quality is unhealthy (${aqi} AQI). It's not a good time for firecrackers.`;
      } else if (aqi > 100) {
        recommendation = `The air quality is moderately unhealthy (${aqi} AQI). Be mindful of your cracker usage.`;
      } else {
        recommendation = `The air quality is good (${aqi} AQI). Enjoy your celebrations responsibly!`;
      }

      // Correctly extract the city name from the nested response data
      const cityName = data.data.city?.name || city;

      return { 
        success: true, 
        data: {
          aqi: aqi,
          city: cityName,
          recommendation: recommendation,
        }
      };
    } else {
      return { success: false, error: data.data || "Could not retrieve air quality data." };
    }
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred while fetching air quality data." };
  }
}
