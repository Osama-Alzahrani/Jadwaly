<p align="center">
  <img src="assets/images/logo.png" alt="Jadwaly Logo" width="120"/>
</p>

<h1 align="center">Jadwaly (جدولي)</h1>

<p align="center">
  <strong>Open-Source University Schedule Builder — Chrome Extension</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-supported-universities">Universities</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-building-for-production">Build</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

---

**Jadwaly** is a Chrome Extension that helps Saudi university students organize their academic schedules effortlessly. It scrapes course data directly from the student portal, then provides an interactive, visual interface to build conflict-free timetables — no manual data entry required.

> **We need your help!** This project is open source and we encourage developers to contribute, add support for more universities, and improve the codebase.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Automatic Data Extraction** | One-click scraping of offered courses from the student portal — including section numbers, instructors, times, and rooms. |
| **Visual Timetable Builder** | Interactive weekly schedule grid. Click a section to add it; click again to remove. |
| **Time Conflict Detection** | Automatically prevents adding sections that overlap in time and highlights the conflict. |
| **Exam Conflict Detection** | Checks for overlapping exam dates across selected courses and warns the user. |
| **Exam Schedule View** | Dedicated view to organize and visualize your exam dates in a clean table. |
| **Export as Image** | Download your final timetable or exam schedule as a high-quality PNG screenshot. |
| **Dark Mode** | Built-in dark/light theme toggle for comfortable viewing. |
| **Course Filtering** | Filter sections by location, days off, or search by course name/code. |
| **Credit Hours Counter** | Automatically tallies total credit hours of selected sections. |
| **Guided Tour** | First-time users get an interactive walkthrough of all features. |

---

## 🎓 Supported Universities

| University | Portal URL |
|---|---|
| **Qassim University** (جامعة القصيم) | `stu-gate.qu.edu.sa` |
| **Umm Al-Qura University** (جامعة أم القرى) | `uqu.edu.sa` |

> Adding a new university? See [Contributing → Add More Universities](#-ideas-for-contribution-roadmap).

---

## 📥 Installation

### From Source (Developer Mode)

1. **Clone** this repository:
   ```bash
   git clone https://github.com/Osama-Alzahrani/Jadwaly.git
   ```
2. Open **Google Chrome** and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked**.
5. Select the cloned project folder (the one containing `manifest.json`).

The extension icon will appear in your toolbar. You're ready to go!

---

## 📖 Usage

1. **Open your university portal** — Navigate to the *Offered Courses* page (المقررات المطروحة وفق الخطة).
2. **Click the injected button** — You'll see a golden button labeled **"التعديل باستخدام جدولي ✨"** appear on the page. Click it to scrape course data.
3. **Build your schedule** — A new tab opens with the Jadwaly interface:
   - Browse your courses in the sidebar list.
   - Click a section to add it to the weekly grid.
   - Conflicts are detected automatically — you'll get a warning if two sections overlap.
4. **View exams** — Switch to the Exam Schedule view to see and organize your exam dates.
5. **Export** — Click **"Save Schedule"** to download your timetable as a PNG image.
6. **Customize** — Toggle dark mode, filter by location/days, and adjust to your preference.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Platform** | Chrome Extension (Manifest V3) |
| **Frontend** | HTML, CSS, JavaScript |
| **DOM Manipulation** | jQuery |
| **Styling** | Tailwind CSS + Custom CSS |
| **Screenshot Capture** | html2canvas |
| **Color Utilities** | tinycolor |
| **Build / Minification** | Terser (JS), html-minifier-terser (HTML), clean-css (CSS) |

---

## 📁 Project Structure

```
Jadwaly/
├── manifest.json          # Chrome Extension manifest (V3)
├── background.js          # Service worker — handles messaging & tab creation
├── injection.js           # Content script — injects button & scrapes course data
├── main.js                # Main app entry point
├── index.html             # Timetable builder UI
├── popup.html / popup.js  # Extension popup (info + language toggle)
├── style.css              # Main stylesheet
├── build.js               # Production build script (minify + bundle)
├── src/
│   ├── Models/            # Course & Section data models
│   ├── builder/           # Timetable & exam table builders
│   ├── componenet/        # UI components (sidebar, search, sections table, exams)
│   ├── guide/             # First-time user tour
│   ├── local/             # i18n translations
│   ├── logic/             # Core logic (course management, conflict detection)
│   ├── shared/            # Shared config & constants
│   ├── ui/                # Appearance (dark mode)
│   └── utils/             # Utility functions
├── assets/
│   ├── css/               # Injection styles & additional CSS
│   ├── fonts/             # Custom fonts
│   ├── images/            # Icons & logo
│   └── js/                # jQuery, html2canvas, tinycolor, modal helpers
└── dist/                  # Compiled Tailwind output
```

---

## 🎨 Tailwind CSS Setup

This project uses the **Tailwind CSS standalone CLI** — no `npm` Tailwind package required.

1. **Download** the latest `tailwindcss` standalone executable for your OS from the [Tailwind CSS Releases](https://github.com/tailwindlabs/tailwindcss/releases) page.
2. Place the executable (e.g., `tailwindcss.exe` on Windows) in the project root directory.
3. **Run the watcher** to generate optimized CSS:

   ```bash
   tailwindcss -i src/input.css -o dist/output.css --minify --watch
   ```

   This watches for changes in your source files and outputs a minified `dist/output.css` automatically.

> **Tip:** Keep this command running in a separate terminal while developing so your styles stay up to date.

---

## 🏗️ Building for Production

The project includes a build script that minifies all JS, HTML, and CSS files into a `build/` directory:

```bash
# Install dev dependencies
npm install

# Run the build
node build.js
```

The minified, production-ready extension will be output to the `build/` folder.

---

## 🤝 Contributing

We highly encourage the community to continue developing this project! Whether you're a student, a beginner developer, or a pro, your contributions are welcome.

### How to Contribute

1. **Fork** the repository.
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request** — we'll review and merge it!

### 💡 Ideas for Contribution (Roadmap)

| Idea | Details |
|---|---|
| **Add More Universities** | The scraping logic is modular. Adapt `injection.js` to support KSU, KAU, KFUPM, etc. |
| **Modern Framework Migration** | The codebase currently uses jQuery. Migrating to React, Vue, or Svelte would be a huge improvement. |
| **Fix TODOs** | There are several active TODOs — e.g., fixing hardcoded exam-week logic. |
| **Improve Conflict Detection** | Make the algorithm more robust for edge cases. |
| **UI/UX Polish** | Improve responsiveness of the sidebar, modals, and mobile view. |
| **Automated Testing** | Add unit/integration tests for the core scheduling logic. |
| **Firefox Support** | Port the extension to work on Firefox using WebExtension APIs. |

---

## 👤 Author

**Osama Alzahrani**

- GitHub: [@Osama-Alzahrani](https://github.com/Osama-Alzahrani)
- LinkedIn: [Osama Alzahrani](https://www.linkedin.com/in/osama-alzahrani/)

---

## 📄 License

This project is open source and available under the **MIT License**.

```
MIT License

Copyright (c) 2026 Osama Alzahrani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```