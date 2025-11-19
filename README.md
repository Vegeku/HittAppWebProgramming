# HIIT Fitness Workout App

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

A full-stack web application for creating, managing, and executing High-Intensity Interval Training (HIIT) workouts. Built with vanilla JavaScript, Express.js, and SQLite.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Vegeku/HittAppWebProgramming.git
cd HittAppWebProgramming
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:8080
```

## ✨ Key Features

### Dynamic Workout Creation
Users can create custom HIIT workouts by clicking the "Add Workout" button. The intuitive interface allows you to:
- Set workout name and difficulty level
- Add multiple exercises with individual time durations
- Cancel or save changes at any time

**Design Decision**: The form-based approach provides a familiar user experience while maintaining flexibility. Session storage ensures data persists during workout creation, preventing accidental data loss during navigation.

### Workout Management & Editing
Once created, workouts can be fully managed through an edit interface accessible via the edit button on each workout card. This feature supports:
- Modifying workout metadata (name, difficulty, duration)
- Adding or removing exercises
- Deleting entire workouts

**Design Decision**: Edit functionality is separated from creation to maintain clear user intent and prevent accidental modifications. The dedicated edit page provides a focused environment for workout refinement.

### Exercise Configuration
Exercises are managed within the context of their parent workout, ensuring logical organization. Users can:
- Add exercises with custom names and durations
- Edit exercise details inline
- Remove exercises individually

**Design Decision**: Nested exercise management maintains data integrity and provides a clear hierarchy. This approach mirrors real-world workout structure where exercises are components of a larger routine.

### Interactive Workout Timer
The workout execution interface features:
- **Visual feedback**: Color transitions highlight the current exercise
- **Audio cues**: Beep sounds signal exercise transitions
- **Real-time countdown**: Displays remaining time for current exercise and total workout
- **Progress tracking**: Shows current and next exercise

**Design Decision**: Multi-sensory feedback (visual + audio) ensures users stay engaged without constantly watching the screen, crucial for high-intensity exercises. The countdown timer creates urgency and maintains workout rhythm.

### Responsive Mobile-First Design
The application adapts seamlessly to different screen sizes with:
- Touch-optimized controls for mobile devices
- Hover effects on desktop that simulate tap behavior on mobile
- Fluid layouts that scale appropriately

**Design Decision**: Mobile-first approach ensures the app works well on devices users are most likely to use during workouts (phones, tablets). CSS transitions and JavaScript event handling create a native app-like experience.




## 🛠️ Technical Stack

### Backend
- **Express.js**: RESTful API server
- **SQLite**: Lightweight database for workout persistence
- **Node.js**: Server runtime environment

### Frontend
- **Vanilla JavaScript**: No framework dependencies for optimal performance
- **Web Components**: Custom elements with Shadow DOM for encapsulation
- **CSS3**: Modern styling with transitions and responsive layouts
- **Session Storage**: Client-side data persistence

### API Endpoints
```
GET    /workouts        - Retrieve all workouts
GET    /workout/:id     - Get specific workout details
POST   /workout         - Create new workout
PUT    /workout/:id     - Update existing workout
DELETE /workout/:id     - Remove workout
```

## 🎨 Design & Architecture

### Component-Based Structure
The application uses Web Components for modular, reusable UI elements:
- `workout-card`: Displays workout summary cards
- `exercise-info`: Manages individual exercise display and editing
- `time-setter`: Handles time input for exercises

**Benefits**: Encapsulation through Shadow DOM prevents style conflicts and creates a clear separation of concerns.

### Event-Driven Communication
Custom events enable communication between isolated components:
```javascript
// Example: Exercise deletion event bubbling
this.dispatchEvent(new CustomEvent('deleteExercise', {
    bubbles: true,
    detail: { index: this.index }
}));
```

### State Management
Session storage maintains workout state during creation and editing phases, while the SQLite database provides permanent persistence.

## 📱 Features Implementation

### Audio Feedback System
Implemented using the Web Audio API to provide:
- Button click sound effects for user interaction confirmation
- Exercise transition beeps for hands-free workout tracking

### Visual Transition Effects
CSS transitions combined with JavaScript class toggling create smooth visual feedback:
```css
.highlight {
    background-color: #4CAF50;
    transition: background-color 0.5s ease-in-out;
}
```

### Responsive Touch Handling
JavaScript event listeners manage both mouse and touch events:
- Desktop: Hover states for interactive elements
- Mobile: Touch events with active class toggling

## 🧰 Development Resources

### Tools & Assets
- **Icons**: [Iconify Icon Sets](https://icon-sets.iconify.design/?query=pause) - Pause, play, and control icons
- **Border Styling**: [Fancy Border Radius](https://9elements.github.io/fancy-border-radius/#60.23.100.0--184.630) - Custom border radius generator

### AI-Assisted Development
Selected examples of AI assistance used during development:

**Shadow DOM Event Handling**
> **Challenge**: Delete and edit buttons within Shadow DOM were not responding to parent event listeners


> **Solution**: Implemented custom event bubbling from within the Shadow DOM
>
> *Key Insight*: Shadow DOM encapsulation requires explicit event propagation using `CustomEvent` with `bubbles: true`. This maintains component isolation while enabling parent-child communication.

**Boolean Attribute Type Coercion**
> **Challenge**: Attribute values returning as strings instead of booleans, causing conditional logic failures
>
> **Solution**: Implemented explicit type conversion in attribute getters
> ```javascript
> get editable() {
>     return this.getAttribute('editable') === 'true';
> }
> ```
> *Key Insight*: HTML attributes are always strings; explicit comparison prevents truthy/falsy evaluation bugs.

**Session Storage Data Serialization**
> **Challenge**: Passing complex nested objects between pages using session storage
>
> **Solution**: Proper JSON serialization and deserialization with type conversion
> ```javascript
> el.totalTime = parseInt(sessionStorage.getItem('totalTime'), 10);
> el.exerciseList = workoutExercises.exercises.map(exercise => JSON.parse(exercise));
> ```
> *Key Insight*: Session storage only handles strings; systematic serialization/deserialization ensures data integrity across page navigation.

**Mobile Touch vs Desktop Hover**
> **Challenge**: Creating unified interaction patterns across touch and pointer devices
>
> **Solution**: Combined CSS hover states with JavaScript touch event handlers and active class toggling
>
> *Key Insight*: Progressive enhancement approach ensures functionality on all devices while providing enhanced experiences where supported.

## 🎯 Project Goals & Outcomes

This project demonstrates:
- **Full-stack development** with modern JavaScript patterns
- **Responsive design** principles and mobile-first methodology
- **Web Components** and Shadow DOM for component architecture
- **RESTful API** design and implementation
- **Database integration** with SQLite
- **User experience** optimization through multi-sensory feedback
- **Problem-solving** with AI-assisted development tools


