# Interstellix - Today in Space History 🚀

A responsive and visually engaging web application that allows users to explore real astronomical events that happened on any given date in history. Dive into space missions, discoveries, satellite launches, and cosmic milestones through an immersive, futuristic interface, complete with an interactive astronaut companion and system diagnostics.

## 🌟 Features

-   **Real-time Space History**: Discover space events that occurred on today's date or any selected date throughout history. Events are currently sourced from local data.
-   **Interactive Date Explorer**: Easily select any date to uncover its unique space-related historical events.
-   **Astronomy Picture of the Day (APOD)**: View the latest stunning image or video from NASA's APOD, complete with explanations.
-   **Immersive Design**: Experience a futuristic space-themed interface with a dynamic animated starfield background, glassmorphism UI elements, and cosmic gradients.
-   **Responsive Layout**: Optimized for seamless viewing and interaction across all screen sizes (mobile, tablet, desktop).
-   **Interactive Astronaut Companion**: Engage in a chat with an AI astronaut, who provides facts, jokes, and information about space events. The astronaut hint bubble intelligently appears and cycles through messages.
-   **System Diagnostics Terminal**: A simulated terminal for launching system checks and recovering from a "critical failure" scenario, adding an interactive narrative element.
-   **Background Audio**: Enjoy an ambient space hum with the ability to mute/unmute.

## 🛠️ Tech Stack

Interstellix is built using a modern and efficient web development stack:

*   **Frontend Framework**: React 18 with TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS for utility-first styling, with custom animations defined in `src/index.css`.
*   **UI Components**: Shadcn/ui components for accessible and customizable UI.
*   **Icons**: Lucide React for a wide range of vector icons.
*   **Routing**: React Router for client-side navigation.
*   **Data Fetching**: React Query for efficient data fetching and caching (used for APOD).
*   **Date Management**: `date-fns` for date formatting and manipulation.
*   **Notifications**: Sonner for elegant toast notifications.

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ and npm
-   Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Pratyush2005/Interstellix.git
    cd Interstellix
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:8080` to view the application.

### Building for Production

```bash
npm run build
npm run preview
```

## 🎨 Design Features

-   **Animated Starfield**: A dynamic canvas-based particle system creating an immersive space environment.
-   **Glassmorphism UI**: Modern frosted glass effects for interface elements, enhancing the futuristic feel.
-   **Gradient Accents**: Subtle cyan-to-blue gradients used throughout the interface for a cohesive cosmic theme.
-   **Smooth Animations**: CSS transitions and transforms for enhanced user experience, including floating elements and glowing effects.
-   **Typography**: Utilizes "Inter" and "Space Mono" fonts for a clean, modern, and space-age aesthetic.
-   **Custom Cursor**: A unique rocket cursor for an added touch of immersion.

## 📱 Responsive Design

The website is fully responsive across all devices:
-   **Mobile**: Optimized touch interactions and stacked layouts.
-   **Tablet**: Balanced grid layouts and readable text sizes.
-   **Desktop**: Full-width layouts with complex animations and detailed UI.

## 🌌 Interactive Features

1.  **Date Explorer**: Select any date using the integrated date picker to view historical space events specific to that day.
2.  **Event Timeline**: A chronological display of space milestones, each presented in an interactive card with details and external links.
3.  **Astronaut Chat**: Click the floating astronaut to open a chat window. Engage in a conversation, ask about today's events, space facts, or even a joke!
4.  **System Diagnostics**: Launch a simulated terminal to run system checks, adding a fun, interactive narrative.
5.  **Mute/Unmute Audio**: Toggle background ambient sound for a personalized experience.

## 🔧 Customization

### Adding New Space Events

Events are currently stored in `src/data/spaceEventsData.json`. To add new events, simply add objects to this JSON array:

```json
{
  "month": 6, 
  "day": 25, 
  "year": 2024, 
  "type": "launch",
  "title": "Your Event Title",
  "description": "Your event description...",
  "image": "🚀", 
  "wikipediaLink": "https://en.wikipedia.org/wiki/Your_Event"
}
```

### Styling Customization

-   Colors are primarily defined in `tailwind.config.ts`.
-   Custom animations and global styles are in `src/index.css`.
-   Component styles use Tailwind utility classes.

## 📊 Performance & Accessibility

-   **Lighthouse Score**: Optimized for performance, accessibility, and SEO.
-   **Semantic HTML**: Proper heading hierarchy and ARIA labels.
-   **Keyboard Navigation**: Full keyboard accessibility support.
-   **Screen Readers**: Alt text and descriptive labels throughout.


## 📄 License

This project is created for educational purposes and competition submission. All space data is sourced from public domain information.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📞 Support

For questions or issues, please open an issue in the GitHub repository.

---

**Built with ❤️ for space exploration enthusiasts**
