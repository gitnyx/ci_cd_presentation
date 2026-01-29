import test from "node:test";
import assert from "node:assert";
import { buildGeoUrl, buildWeatherUrl, formatWeather } from "../weather.js";

test("buildGeoUrl creates correct URL", () => {
  const url = buildGeoUrl("Berlin", "KEY");
  assert.ok(url.includes("Berlin"));
});

test("buildWeatherUrl includes lat/lon", () => {
  const url = buildWeatherUrl(10, 20, "KEY");
  assert.ok(url.includes("lat=10"));
  assert.ok(url.includes("lon=20"));
});

test("formatWeather extracts values", () => {
  const mock = {
    main: { temp: 15 },
    wind: { speed: 3 },
    weather: [{ icon: "01d" }]
  };

  const result = formatWeather(mock);
  assert.equal(result.temp, 15);
  assert.equal(result.wind, 3);
  assert.equal(result.icon, "01d");
});
