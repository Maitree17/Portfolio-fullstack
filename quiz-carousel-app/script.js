/* =========================================================
   PART 1 — IMAGE CAROUSEL
   ========================================================= */
const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.slide');
const dotsBox = document.getElementById('dots');
let current = 0;
let autoTimer;

slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsBox.appendChild(dot);
});
const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  resetAutoplay();
}

document.getElementById('nextBtn').addEventListener('click', () => goToSlide(current + 1));
document.getElementById('prevBtn').addEventListener('click', () => goToSlide(current - 1));

function resetAutoplay() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goToSlide(current + 1), 4000);
}
resetAutoplay();

/* =========================================================
   PART 2 — INTERACTIVE QUIZ
   ========================================================= */
const quizData = [
  { q: "Which CSS feature lets you apply different styles based on screen size?", options: ["Flexbox", "Media Queries", "Grid", "Position: sticky"], answer: 1 },
  { q: "What does the 'fetch()' function return in JavaScript?", options: ["A string", "A Promise", "An Array", "A Number"], answer: 1 },
  { q: "Which HTTP method is typically used to GET data from an API?", options: ["POST", "PUT", "GET", "DELETE"], answer: 2 },
  { q: "In responsive design, what unit adapts based on viewport width?", options: ["px", "vw", "pt", "in"], answer: 1 },
  { q: "Which method converts a fetch response body into JSON?", options: [".text()", ".json()", ".parse()", ".stringify()"], answer: 1 },
];

let qIndex = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById('questionText');
const optionsBox = document.getElementById('optionsBox');
const qNum = document.getElementById('qNum');
const qTotal = document.getElementById('qTotal');
const scoreDisplay = document.getElementById('scoreDisplay');
const nextQBtn = document.getElementById('nextQBtn');
const quizCard = document.getElementById('quizCard');
const quizResult = document.getElementById('quizResult');

qTotal.textContent = quizData.length;

function renderQuestion() {
  answered = false;
  nextQBtn.disabled = true;
  const current = quizData[qIndex];
  qNum.textContent = `Question ${qIndex + 1}`;
  questionText.textContent = current.q;
  optionsBox.innerHTML = '';

  current.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    optionsBox.appendChild(btn);
  });
}

function selectAnswer(i, btn) {
  if (answered) return;
  answered = true;
  const current = quizData[qIndex];
  const allBtns = optionsBox.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  if (i === current.answer) {
    btn.classList.add('correct');
    score++;
  } else {
    btn.classList.add('wrong');
    allBtns[current.answer].classList.add('correct');
  }
  scoreDisplay.textContent = `Score: ${score}`;
  nextQBtn.disabled = false;
}

nextQBtn.addEventListener('click', () => {
  qIndex++;
  if (qIndex < quizData.length) {
    renderQuestion();
  } else {
    quizCard.hidden = true;
    quizResult.hidden = false;
    document.getElementById('finalScoreText').textContent =
      `You scored ${score} out of ${quizData.length}.`;
  }
});

document.getElementById('restartQuiz').addEventListener('click', () => {
  qIndex = 0;
  score = 0;
  scoreDisplay.textContent = 'Score: 0';
  quizResult.hidden = true;
  quizCard.hidden = false;
  renderQuestion();
});

renderQuestion();

/* =========================================================
   PART 3 — LIVE PUBLIC API FETCHES
   ========================================================= */

/* --- Weather (Open-Meteo: free, no API key needed) --- */
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

const weatherCodeMap = {
  0: "Clear sky ☀️", 1: "Mainly clear 🌤️", 2: "Partly cloudy ⛅", 3: "Overcast ☁️",
  45: "Fog 🌫️", 48: "Depositing rime fog 🌫️",
  51: "Light drizzle 🌦️", 53: "Drizzle 🌦️", 55: "Dense drizzle 🌧️",
  61: "Slight rain 🌧️", 63: "Rain 🌧️", 65: "Heavy rain 🌧️",
  71: "Slight snow 🌨️", 73: "Snow 🌨️", 75: "Heavy snow ❄️",
  80: "Rain showers 🌦️", 81: "Rain showers 🌧️", 82: "Violent rain showers ⛈️",
  95: "Thunderstorm ⛈️", 96: "Thunderstorm with hail ⛈️", 99: "Severe thunderstorm ⛈️"
};

weatherForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  weatherResult.innerHTML = `<p class="hint">Fetching weather for "${city}"…</p>`;

  try {
    // Step 1: geocode the city name to lat/lon
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      weatherResult.innerHTML = `<p class="error-text">City not found. Try a different spelling.</p>`;
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: fetch current weather for those coordinates
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();
    const cw = weatherData.current_weather;

    const desc = weatherCodeMap[cw.weathercode] || "Unknown conditions";

    weatherResult.innerHTML = `
      <div class="weather-city">${name}, ${country}</div>
      <div class="weather-temp">${Math.round(cw.temperature)}°C</div>
      <div class="weather-desc">${desc} · Wind ${cw.windspeed} km/h</div>
    `;
  } catch (err) {
    weatherResult.innerHTML = `<p class="error-text">Something went wrong fetching weather data. Please try again.</p>`;
  }
});

/* --- Random dad joke (icanhazdadjoke: free, no API key needed) --- */
const jokeBtn = document.getElementById('jokeBtn');
const jokeResult = document.getElementById('jokeResult');

async function fetchJoke() {
  jokeResult.innerHTML = `<p class="hint">Fetching a joke…</p>`;
  try {
    const res = await fetch('https://icanhazdadjoke.com/', {
      headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();
    jokeResult.innerHTML = `<p class="joke-text">"${data.joke}"</p>`;
  } catch (err) {
    jokeResult.innerHTML = `<p class="error-text">Couldn't fetch a joke right now. Please try again.</p>`;
  }
}

jokeBtn.addEventListener('click', fetchJoke);
fetchJoke(); // load one on page load
