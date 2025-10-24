import { Link } from "react-router-dom";
import notFoundStyle from "./NotFound.module.css";

export default function NotFound() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen 
      bg-gradient-to-br from-[var(--sand-100)] via-[var(--sage-100)] to-[var(--sky-100)]
      dark:from-[var(--color-bg)] dark:via-[var(--color-surface)] dark:to-[var(--sky-400)]
      overflow-hidden"
    >
      {/* floating blurred orbs */}
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-[var(--sand-200)] dark:bg-[var(--wood-400)] rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 -right-40 w-[32rem] h-[32rem] bg-[var(--sky-200)] dark:bg-[var(--sky-400)] rounded-full opacity-30 blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-0 left-1/3 w-[28rem] h-[28rem] bg-[var(--sage-300)] dark:bg-[var(--sage-700)] rounded-full opacity-30 blur-2xl animate-pulse delay-2000"></div>

      {/* rotating border rings */}
      <div
        className={`absolute w-96 h-96 border border-[var(--color-accent)] dark:border-[var(--color-primary)] rounded-full opacity-40 ${notFoundStyle.animateSpinSlow}`}
      ></div>
      <div className="absolute w-[28rem] h-[28rem] border border-[var(--color-secondary)] dark:border-[var(--color-primary-hover)] rounded-full opacity-30 animate-spin-slow delay-500"></div>

      {/* Main 404 title */}
      <h1
        className="relative z-10 text-[10rem] md:text-[12rem] font-extrabold tracking-widest text-transparent bg-clip-text 
        bg-gradient-to-r from-[var(--color-primary)] via-[var(--sand-400)] to-[var(--sky-400)]
        dark:from-[var(--color-secondary)] dark:via-[var(--color-primary)] dark:to-[var(--sky-300)]
        animate-bounce drop-shadow-lg"
      >
        404
      </h1>

      {/* subtitle */}
      <h2 className="relative z-10 mt-2 text-3xl md:text-4xl font-semibold text-[var(--color-text)] dark:text-[var(--color-text)]">
        Oops! Page not found
      </h2>

      {/* description */}
      <p className="relative z-10 mt-3 max-w-md text-center text-[var(--color-text-muted)] text-lg dark:text-[var(--color-text-muted)]">
        The page you’re looking for might have been moved, deleted, or never
        existed. Let’s get you back on track.
      </p>

      <Link
        to="/"
        className="relative z-10 mt-8 inline-block px-10 py-4 text-lg font-medium rounded-full 
        bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]
        hover:from-[var(--color-primary-hover)] hover:via-[var(--sand-400)] hover:to-[var(--sky-300)]
        text-[var(--color-bg)] dark:text-[var(--color-darkText)]
        transition-all duration-500 shadow-md hover:shadow-xl hover:scale-105"
      >
        Back to Home
      </Link>
    </section>
  );
}
