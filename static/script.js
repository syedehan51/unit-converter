// Each category has a "code" (short instrument-style label) and a set of
// units expressed as a factor relative to one base unit. Temperature is
// handled separately since it isn't a simple multiplication.

const CATEGORIES = {
  length: {
    code: "L",
    label: "Length",
    base: "meter",
    units: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      mile: 1609.344,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
    },
  },
  weight: {
    code: "M",
    label: "Weight",
    base: "kilogram",
    units: {
      kilogram: 1,
      gram: 0.001,
      milligram: 0.000001,
      "metric ton": 1000,
      pound: 0.45359237,
      ounce: 0.028349523125,
      stone: 6.35029318,
    },
  },
  temperature: {
    code: "T",
    label: "Temperature",
    base: "celsius",
    units: { celsius: 1, fahrenheit: 1, kelvin: 1 }, // handled specially
  },
  volume: {
    code: "V",
    label: "Volume",
    base: "liter",
    units: {
      liter: 1,
      milliliter: 0.001,
      "cubic meter": 1000,
      "gallon (US)": 3.785411784,
      "quart (US)": 0.946352946,
      "pint (US)": 0.473176473,
      "cup (US)": 0.2365882365,
      "fluid ounce (US)": 0.0295735295625,
    },
  },
  speed: {
    code: "S",
    label: "Speed",
    base: "m/s",
    units: {
      "m/s": 1,
      "km/h": 1 / 3.6,
      mph: 0.44704,
      knot: 0.514444,
      "ft/s": 0.3048,
    },
  },
  area: {
    code: "A",
    label: "Area",
    base: "sq meter",
    units: {
      "sq meter": 1,
      "sq kilometer": 1000000,
      "sq foot": 0.09290304,
      "sq yard": 0.83612736,
      acre: 4046.8564224,
      hectare: 10000,
      "sq mile": 2589988.110336,
    },
  },
    data: {
    code: "D",
    label: "Data",
    base: "byte",
    units: {
      byte: 1,
      bit: 0.125,
      "kilobyte (KB)": 1000,
      "megabyte (MB)": 1000000,
      "gigabyte (GB)": 1000000000,
      "terabyte (TB)": 1000000000000,
    },
  },
  time: {
    code: "Ti",
    label: "Time",
    base: "second",
    units: {
      second: 1,
      millisecond: 0.001,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      "year (365 days)": 31536000,
    },
  },
  energy: {
    code: "E",
    label: "Energy",
    base: "joule",
    units: {
      joule: 1,
      kilojoule: 1000,
      calorie: 4.184,
      kilocalorie: 4184,
      "watt-hour": 3600,
      "kilowatt-hour": 3600000,
      BTU: 1055.06,
    },
  },
  pressure: {
    code: "P",
    label: "Pressure",
    base: "pascal",
    units: {
      pascal: 1,
      kilopascal: 1000,
      bar: 100000,
      psi: 6894.757,
      atmosphere: 101325,
      mmHg: 133.322,
    },
  },
};

let currentCategory = "length";

const categoryIndex = document.getElementById("categoryIndex");
const fromValue = document.getElementById("fromValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const toValueEl = document.getElementById("toValue");
const conversionLine = document.getElementById("conversionLine");
const swapBtn = document.getElementById("swapBtn");

function buildCategoryIndex() {
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-btn" + (key === currentCategory ? " active" : "");
    btn.dataset.category = key;
    btn.innerHTML = `<span class="code">${cat.code}</span><span>${cat.label}</span>`;
    btn.addEventListener("click", () => selectCategory(key));
    categoryIndex.appendChild(btn);
  });
}

function selectCategory(key) {
  currentCategory = key;
  [...categoryIndex.children].forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === key);
  });
  populateUnitSelectors();
  convert();
}

function populateUnitSelectors() {
  const units = Object.keys(CATEGORIES[currentCategory].units);
  fromUnit.innerHTML = units.map((u) => `<option value="${u}">${u}</option>`).join("");
  toUnit.innerHTML = units.map((u) => `<option value="${u}">${u}</option>`).join("");
  fromUnit.value = units[0];
  toUnit.value = units[1] || units[0];
}

function convertTemperature(value, from, to) {
  // normalize to celsius first
  let celsius;
  if (from === "celsius") celsius = value;
  else if (from === "fahrenheit") celsius = (value - 32) * (5 / 9);
  else if (from === "kelvin") celsius = value - 273.15;

  if (to === "celsius") return celsius;
  if (to === "fahrenheit") return celsius * (9 / 5) + 32;
  if (to === "kelvin") return celsius + 273.15;
}

function formatResult(n) {
  if (!isFinite(n)) return "—";
  // trim to a sane number of decimals without trailing zeros
  const rounded = Math.round(n * 1e6) / 1e6;
  return rounded.toString();
}

function convert() {
  const raw = parseFloat(fromValue.value);
  const cat = CATEGORIES[currentCategory];

  if (isNaN(raw)) {
    toValueEl.textContent = "0";
    conversionLine.textContent = `Enter a number to convert ${cat.label.toLowerCase()}`;
    return;
  }

  let result;
  if (currentCategory === "temperature") {
    result = convertTemperature(raw, fromUnit.value, toUnit.value);
  } else {
    const fromFactor = cat.units[fromUnit.value];
    const toFactor = cat.units[toUnit.value];
    result = (raw * fromFactor) / toFactor;
  }

  toValueEl.textContent = formatResult(result);
  conversionLine.textContent = `1 ${fromUnit.value} = ${formatResult(
    currentCategory === "temperature"
      ? convertTemperature(1, fromUnit.value, toUnit.value)
      : cat.units[fromUnit.value] / cat.units[toUnit.value]
  )} ${toUnit.value}`;
}

swapBtn.addEventListener("click", () => {
  const tmp = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = tmp;
  convert();
});

fromValue.addEventListener("input", convert);
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);

buildCategoryIndex();
populateUnitSelectors();
convert();

