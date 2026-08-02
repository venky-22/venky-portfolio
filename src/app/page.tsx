"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";

// ─── Scroll Reveal ──────────────────────────────────────────────────────────
function ScrollReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </div>
  );
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1500;
          const start = performance.now();
          const isFloat = !Number.isInteger(value);

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(isFloat ? parseFloat((eased * value).toFixed(2)) : Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="rounded-lg border border-border/60 bg-card p-4 text-center hover:border-border transition-colors duration-300 card-glow">
      <div className="text-2xl font-bold tracking-tight counter-value">{display}{suffix}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

// ─── Cursor Spotlight ───────────────────────────────────────────────────────
function CursorSpotlight() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      className="cursor-spotlight"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, hsl(var(--foreground) / 0.04), transparent 40%)`,
      }}
    />
  );
}

// ─── Typing Text ────────────────────────────────────────────────────────────
function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 35);
    return () => clearTimeout(timeout);
  }, [displayed, started, text]);

  return (
    <span className={displayed.length < text.length ? "typing-cursor" : ""}>
      {displayed}
    </span>
  );
}

// ─── Back to Top ────────────────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`back-to-top fixed bottom-24 right-6 z-20 size-10 rounded-full border border-border bg-background shadow-lg flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 ${visible ? "visible" : ""}`}
      aria-label="Back to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
    </button>
  );
}

// ─── Theme ───────────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(stored);
      document.documentElement.style.colorScheme = stored;
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    document.documentElement.style.colorScheme = next;
  };

  return { theme, toggle };
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home size-4">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function NotebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-notebook size-4">
      <path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" />
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M16 2v20" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 438.549 438.549" className="size-4">
      <path fill="currentColor" d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-4">
      <title>LinkedIn</title>
      <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200 theme-toggle-icon">
      <path d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0.5 7C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H2.5C2.77614 8 3 7.77614 3 7.5C3 7.22386 2.77614 7 2.5 7H0.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden h-[1.2rem] w-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200 theme-toggle-icon">
      <path d="M2.89998 0.499976C2.89998 0.279062 2.72089 0.0999756 2.49998 0.0999756C2.27906 0.0999756 2.09998 0.279062 2.09998 0.499976V1.09998H1.49998C1.27906 1.09998 1.09998 1.27906 1.09998 1.49998C1.09998 1.72089 1.27906 1.89998 1.49998 1.89998H2.09998V2.49998C2.09998 2.72089 2.27906 2.89998 2.49998 2.89998C2.72089 2.89998 2.89998 2.72089 2.89998 2.49998V1.89998H3.49998C3.72089 1.89998 3.89998 1.72089 3.89998 1.49998C3.89998 1.27906 3.72089 1.09998 3.49998 1.09998H2.89998V0.499976ZM5.89998 3.49998C5.89998 3.27906 5.72089 3.09998 5.49998 3.09998C5.27906 3.09998 5.09998 3.27906 5.09998 3.49998V4.09998H4.49998C4.27906 4.09998 4.09998 4.27906 4.09998 4.49998C4.09998 4.72089 4.27906 4.89998 4.49998 4.89998H5.09998V5.49998C5.09998 5.72089 5.27906 5.89998 5.49998 5.89998C5.72089 5.89998 5.89998 5.72089 5.89998 5.49998V4.89998H6.49998C6.72089 4.89998 6.89998 4.72089 6.89998 4.49998C6.89998 4.27906 6.72089 4.09998 6.49998 4.09998H5.89998V3.49998ZM1.89998 6.49998C1.89998 6.27906 1.72089 6.09998 1.49998 6.09998C1.27906 6.09998 1.09998 6.27906 1.09998 6.49998V7.09998H0.499976C0.279062 7.09998 0.0999756 7.27906 0.0999756 7.49998C0.0999756 7.72089 0.279062 7.89998 0.499976 7.89998H1.09998V8.49998C1.09998 8.72089 1.27906 8.89997 1.49998 8.89997C1.72089 8.89997 1.89998 8.72089 1.89998 8.49998V7.89998H2.49998C2.72089 7.89998 2.89998 7.72089 2.89998 7.49998C2.89998 7.27906 2.72089 7.09998 2.49998 7.09998H1.89998V6.49998ZM8.54406 0.98184L8.24618 0.941586C8.03275 0.917676 7.90692 1.1655 8.02936 1.34194C8.17013 1.54479 8.29981 1.75592 8.41754 1.97445C8.91878 2.90485 9.20322 3.96932 9.20322 5.10022C9.20322 8.37201 6.82247 11.0878 3.69887 11.6097C3.45736 11.65 3.20988 11.6772 2.96008 11.6906C2.74563 11.702 2.62729 11.9535 2.77721 12.1072C2.84551 12.1773 2.91535 12.2458 2.98667 12.3128L3.05883 12.3795L3.31883 12.6045L3.50684 12.7532L3.62796 12.8433L3.81491 12.9742L3.99079 13.089C4.11175 13.1651 4.23536 13.2375 4.36157 13.3059L4.62496 13.4412L4.88553 13.5607L5.18837 13.6828L5.43169 13.7686C5.56564 13.8128 5.70149 13.8529 5.83857 13.8885C5.94262 13.9155 6.04767 13.9401 6.15405 13.9622C6.27993 13.9883 6.40713 14.0109 6.53544 14.0298L6.85241 14.0685L7.11934 14.0892C7.24637 14.0965 7.37436 14.1002 7.50322 14.1002C11.1483 14.1002 14.1032 11.1453 14.1032 7.50023C14.1032 7.25044 14.0893 7.00389 14.0623 6.76131L14.0255 6.48407C13.991 6.26083 13.9453 6.04129 13.8891 5.82642C13.8213 5.56709 13.7382 5.31398 13.6409 5.06881L13.5279 4.80132L13.4507 4.63542L13.3766 4.48666C13.2178 4.17773 13.0353 3.88295 12.8312 3.60423L12.6782 3.40352L12.4793 3.16432L12.3157 2.98361L12.1961 2.85951L12.0355 2.70246L11.8134 2.50184L11.4925 2.24191L11.2483 2.06498L10.9562 1.87446L10.6346 1.68894L10.3073 1.52378L10.1938 1.47176L9.95488 1.3706L9.67791 1.2669L9.42566 1.1846L9.10075 1.09489L8.83599 1.03486L8.54406 0.98184ZM10.4032 5.30023C10.4032 4.27588 10.2002 3.29829 9.83244 2.40604C11.7623 3.28995 13.1032 5.23862 13.1032 7.50023C13.1032 10.593 10.596 13.1002 7.50322 13.1002C6.63646 13.1002 5.81597 12.9036 5.08355 12.5522C6.5419 12.0941 7.81081 11.2082 8.74322 10.0416C8.87963 10.2284 9.10028 10.3497 9.34928 10.3497C9.76349 10.3497 10.0993 10.0139 10.0993 9.59971C10.0993 9.24256 9.84965 8.94373 9.51535 8.86816C9.57741 8.75165 9.63653 8.63334 9.6926 8.51332C9.88358 8.63163 10.1088 8.69993 10.35 8.69993C11.0403 8.69993 11.6 8.14028 11.6 7.44993C11.6 6.75976 11.0406 6.20024 10.3505 6.19993C10.3853 5.90487 10.4032 5.60464 10.4032 5.30023Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

function Separator({ className = "" }: { className?: string }) {
  return <div className={`shrink-0 bg-border w-[1px] h-full ${className}`} />;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const projectCards = [
  {
    title: "Marine Species Classification",
    date: "2023",
    description: "An automated system that classifies marine species from images using deep learning techniques. Leverages CNN architectures to identify and categorize marine animals from drone-captured imagery.",
    tags: ["Python", "Deep Learning", "CNN", "Jupyter Notebook"],
    href: "https://github.com/venky-22/Marine-species-classification",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&auto=format",
  },
  {
    title: "Disaster Tweet Analysis Using BERT",
    date: "2023",
    description: "Analyzes tweets related to disasters, utilizing BERT to classify tweets as real or fake for rapid emergency response.",
    tags: ["Python", "BERT", "NLP", "Jupyter Notebook"],
    href: "https://github.com/venky-22/Disaster-Tweet-Analysis-Using-BERT",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=400&fit=crop&auto=format",
  },
  {
    title: "Evolvable Hardware Using Genetic Algorithm",
    date: "2022 – 2023",
    description: "Designed and implemented Evolvable Hardware using Genetic Algorithms on FPGA platforms, achieving faster convergence with 4-point crossover and uniform mutation.",
    tags: ["Python", "FPGA", "Genetic Algorithm", "Research"],
    href: "https://github.com/venky-22",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop&auto=format",
  },
  {
    title: "Itech Expo Application",
    date: "Jan 2022 – Feb 2022",
    description: "Designed and developed a web application for real-time crowd updates and event details, used by 500+ users utilizing HTML, CSS, JavaScript, Node.js, and MongoDB for seamless data delivery.",
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB"],
    href: "https://github.com/venky-22",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&auto=format",
  },
  {
    title: "Home Automation with Raspberry Pi Pico",
    date: "2023",
    description: "Built a home automation system with webserver deployment using Raspberry Pi Pico, enabling remote control of smart devices.",
    tags: ["Raspberry Pi", "IoT", "Web Server", "Research"],
    href: "https://github.com/venky-22",
    image: "https://images.unsplash.com/photo-1631553127988-36343ac5bb0c?w=800&h=400&fit=crop&auto=format",
  },
  {
    title: "Google IT Automation with Python",
    date: "2021",
    description: "Practice files and projects from the Google IT Automation with Python Professional Certificate.",
    tags: ["Python", "Automation", "Git"],
    href: "https://github.com/venky-22/it-cert-automation-practice",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop&auto=format",
  },
];

// ─── Project Card ────────────────────────────────────────────────────────────
function ProjectCard({
  title,
  date,
  description,
  tags,
  href,
  image,
}: {
  title: string;
  date: string;
  description: string;
  tags: string[];
  href?: string;
  image: string;
}) {
  return (
    <div className="group rounded-lg bg-card text-card-foreground flex flex-col overflow-hidden border border-border/60 hover:border-border hover:shadow-[0_8px_40px_-16px_hsl(var(--foreground)/0.15)] transition-all duration-500 h-full card-glow">
      <div className="relative h-44 w-full overflow-hidden">
        <a className="block cursor-pointer h-full" href={href || "#"}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent transition-all duration-500 group-hover:from-black/80" />
        </a>
      </div>
      <div className="flex flex-col px-3 pt-3 flex-1">
        <div className="space-y-1">
          <h3 className="font-semibold tracking-tight text-base">{title}</h3>
          <time className="font-sans text-xs text-muted-foreground">{date}</time>
          <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert leading-relaxed">
            <p>{description}</p>
          </div>
        </div>
      </div>
      <div className="text-pretty font-sans text-sm text-muted-foreground mt-auto flex flex-col px-3 pb-1.5">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-md border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground group-hover:bg-secondary/80 hover:bg-secondary/70 hover:shadow-sm px-1.5 py-0.5 text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {href && (
        <div className="pt-1.5 px-3 pb-3">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/85 hover:shadow-md active:scale-[0.97] gap-1.5 px-2 py-1 text-[10px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            GitHub
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const workItems = [
  {
    title: "Oracle",
    location: "Bengaluru, Karnataka, India · On-site",
    extraInfo: "Full-time · 3 yrs 1 mo",
    logo: "https://tse3.mm.bing.net/th/id/OIP.E6PicxOwVs7id0H0eoHTMgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    roles: [
      {
        subtitle: "Application Software Engineer",
        date: "Jun 2026 – Present · 2 mos",
        description:
          "• Designed and shipped an MCP-based release automation tool that reduced per-bug backport time from ~1 hour to under 5 minutes (90% reduction), recovering 3 hours/day per engineer of productive capacity team-wide\n• Built an ML-powered Payment Chain Classifier in Python, identifying transactions needing repair and generating repair suggestions; integrated the recommendation system into a Java microservice\n• Owned Java/Spring Boot microservices within OBPM - Book Transfer/Instrument and Clearing modules - serving 100+ Tier-1 banks globally, including Citigroup, Wells Fargo, Intesa Sanpaolo, and Barclays, maintaining 99.9% SLA availability",
        skills: ["Model Context Protocol (MCP)", "Git", "Python", "Java", "Spring Boot"],
      },
      {
        subtitle: "Associate Applications Developer",
        date: "Jul 2023 – Jun 2026 · 3 yrs",
        description:
          "• Enhanced payment modules including Book Transfers, Instruments, Clearing, and Indian Payments (RTGS, NEFT, IMPS) using Java, achieving up to 80% efficiency improvement through performance tuning and batch processing\n• Developed RBI-compliant Beneficiary Name Lookup feature in Oracle Banking Payments (OBPM) for NEFT/RTGS by integrating NPCI ReqBeneDetails/RespBeneDetails APIs, enabling payee pre-validation using account number and IFSC; live in production across bank applications\n• Field 72 & Hybrid Addressing: Enabled Field 72 in CAMT/MT messages and hybrid address handling in camt.107-109\n• Established a Virtual Account Management (VAM) system, enabling precise payer identification and automated reconciliation, resulting in a 95% reduction in reconciliation errors for all processed transactions\n• Message Generation: Implemented and enhanced MT900/MT910 and camt.054 message processing for Book Transfers and Book Transfer Reversals, and Clearing\n• Trusted with live production support within 6 months - a responsibility typically reserved for senior engineers - becoming a regular contributor to incident resolution for Tier-1 banking clients\n• Resolved 1,000+ technical issues across Book Transfer/Instrument and Clearing modules over 2 years, covering root-cause diagnosis, fix implementation, and client communication for high-availability distributed banking systems",
        skills: ["Java", "Oracle SQL Developer", "OBPM", "MT/camt", "Microservices"],
      },
    ],
  },
  {
    title: "ELGI Equipments Limited",
    location: "Coimbatore, IN",
    extraInfo: "Oct 2022 – Feb 2023",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/ELGi_Equipments_Logo_%282020%29.png",
    roles: [
      {
        subtitle: "Web Application Developer",
        date: "Oct 2022 – Feb 2023",
        description:
          "• Developed a dynamic website to display compressor data by integrating IoT using PTC ThingWorx and ensured the website's compatibility across various devices",
        skills: ["HTML", "CSS", "JavaScript", "PTC ThingWorx"],
      },
    ],
  },
  {
    title: "Kaar Technologies",
    location: "Chennai, IN",
    extraInfo: "Aug 2021 – Feb 2022",
    logo: "https://mma.prnewswire.com/media/2219899/4544329/KaarTech_Logo.jpg?p=publish",
    roles: [
      {
        subtitle: "Product Developer Intern",
        date: "Aug 2021 – Feb 2022",
        description:
          "• Contributed to the development of employee onboarding management for the 'Kebs' team using Angular\n• Assisted in code conversion from SAP ECC to SAP S/4 Hana applying a bi-directional LSTM model with a 65% accuracy rate",
        skills: ["Angular", "SAP", "LSTM", "Python"],
      },
    ],
  },
  {
    title: "Cisco Networking Academy",
    location: "Remote",
    extraInfo: "Feb 2021 – Aug 2021",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
    roles: [
      {
        subtitle: "Student Intern",
        date: "Feb 2021 – Aug 2021",
        description:
          "• Completed certification courses in Introduction to Cybersecurity, Introduction to Packet Tracer and Cybersecurity Essentials\n• Simulated a secure network as a capstone project using Cisco Packet Tracer, identifying potential vulnerabilities and providing actionable insights",
        skills: ["Cisco Packet Tracer", "Cybersecurity"],
      },
    ],
  },
];

const educationItems = [
  {
    title: "Dalhousie University",
    subtitle: "Masters in Applied Computer Science (MACSc)",
    location: "Halifax, CA",
    date: "Sep 2026 – May 2028 (Expected)",
    logo: "https://www.factsnippet.com/webp-licensed-images/dalhousie-university.webp",
  },
  {
    title: "PSG Institute of Technology and Applied Research",
    subtitle: "Bachelor of Engineering in Computer Science — 9.55 CGPA",
    location: "Coimbatore, IN",
    date: "Jul 2019 – Apr 2023",
    logo: "https://academics.psgitech.ac.in/data1/images/logo.png",
    description: "Secured University Third Rank.",
  },
];

const certificationItems = [
  {
    title: "Google Project Management Specialization",
    subtitle: "Google",
    date: "2023",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    title: "IBM Applied AI",
    subtitle: "IBM",
    date: "2023",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  },
  {
    title: "Google IT Automation Specialization",
    subtitle: "Google",
    date: "2022",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    title: "Deep Learning Specialization",
    subtitle: "DeepLearning.AI",
    date: "2022",
    logo: "https://miro.medium.com/v2/resize:fit:2400/1*xRGy1-tiwlFniQpQlO1kwQ.png",
  },
  {
    title: "CCNAv7: Introduction to Networks",
    subtitle: "Cisco",
    date: "2021",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
  },
  {
    title: "Python for Everybody Specialization",
    subtitle: "University of Michigan",
    date: "2021",
    logo: "https://1000logos.net/wp-content/uploads/2018/08/University-of-Michigan-Symbol-768x432.jpg",
  },
];

const publicationItems = [
  { title: "Vehicular Congestion Detection Using Efficient Routing Protocol with Collision Avoidance in VANET", subtitle: "ICNGCS 2025", date: "2025", location: "India" },
  { title: "Unsupervised Anomaly Detection for Network Intrusion using Deep Autoencoders and Statistical Modeling", subtitle: "ICNGCS 2025", date: "2025", location: "India" },
  { title: "Collaborative Search With Knowledge Sharing And Summarization", subtitle: "ICSES 2024", date: "2024", location: "Nepal" },
  { title: "Predicting the Toxicity of Biomolecules using Graph Kernel", subtitle: "ICC3 2023", date: "2023", location: "India" },
  { title: "Evolvable Hardware Using Genetic Algorithm", subtitle: "BDCC 2023", date: "2023", location: "India" },
  { title: "Home Automation with Webserver Deployment using Raspberry Pi Pico", subtitle: "ICACRS 2023", date: "2023", location: "India" },
  { title: "Evolution of Software Systems from Incubation to Enterprise Solutions", subtitle: "ICSETPSD 2023", date: "2023", location: "India" },
  { title: "Image to Audio Conversion to Aid Visually Impaired People by CNN", subtitle: "ICESC 2023", date: "2023", location: "India" },
  { title: "Effective Marine Animal Detection and Rare Species Classification Using Autonomous Drones", subtitle: "iTech SECOM 2025", date: "2025", location: "India" },
  { title: "Real-Time Anomaly Detection Using Snort and Machine Learning", subtitle: "iTech SECOM 2025", date: "2025", location: "India" },
];

const volunteerItems = [
  {
    title: "Oracle Volunteering",
    subtitle: "Volunteer",
    date: "2023 – Present",
    description: "Participated in community outreach programs organized by Oracle, contributing to technology education and digital literacy initiatives.",
  },
  {
    title: "Aashman Foundation",
    subtitle: "Volunteer",
    date: "2022 – 2023",
    description: "Contributed to foundation initiatives focused on empowering underprivileged communities through education and skill development programs.",
  },
  {
    title: "Beyond Meds Foundation",
    subtitle: "Volunteer",
    date: "2021 – 2022",
    description: "Supported mental health awareness campaigns and assisted in organizing events to promote psychological well-being among students.",
  },
  {
    title: "Unschool",
    subtitle: "Mentor & Volunteer",
    date: "2021 – 2022",
    description: "Mentored students in programming and technology fundamentals, helping them build foundational skills in software development.",
  },
];

const skillCategories = [
  {
    label: "Languages",
    color: "bg-blue-500",
    skills: ["Java", "SQL", "Python", "C", "JavaScript"],
  },
  {
    label: "Tools & Frameworks",
    color: "bg-emerald-500",
    skills: ["REST APIs", "Git", "Oracle SQL", "Microservices", "Oracle ODT", "JMS", "Spring Boot", "Postman", "Eclipse", "VS Code", "PTC ThingWorx", "Cisco Packet Tracer"],
  },
];

// ─── Resume Card ─────────────────────────────────────────────────────────────
function ResumeCard({
  title,
  subtitle,
  location,
  date,
  description,
  logo,
  href,
}: {
  title: string;
  subtitle: string;
  location?: string;
  date?: string;
  description?: string;
  logo?: string;
  href?: string;
}) {
  return (
    <div className="block cursor-pointer group/card">
      <div className="rounded-lg bg-card text-card-foreground flex border border-transparent group-hover/card:border-border/40 group-hover/card:border-l-2 group-hover/card:border-l-foreground transition-all duration-300">
        <div className="flex-none">
          {logo ? (
            <span className="relative flex shrink-0 overflow-hidden rounded-full border size-12 m-auto bg-background dark:bg-foreground">
              <img
                src={logo}
                alt={title}
                className="aspect-square h-full w-full object-contain p-1.5 rounded-full"
                loading="lazy"
              />
            </span>
          ) : (
            <span className="relative flex shrink-0 overflow-hidden rounded-full border size-12 m-auto bg-background dark:bg-foreground">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {title.charAt(0)}
              </span>
            </span>
          )}
        </div>
        <div className="flex-grow ml-4 items-center flex-col group">
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-x-2 text-base">
              <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                {title}
                {location && <span className="text-muted-foreground font-normal ml-1.5">· {location}</span>}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-4 ml-0.5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:ml-1.5 group-hover:opacity-100 rotate-90"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </h3>
              {date && (
                <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right whitespace-nowrap">
                  {date}
                </div>
              )}
            </div>
            <div className="font-sans text-xs text-muted-foreground">{subtitle}</div>
          </div>
          {description && (
            <div className="mt-2 text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Timeline Card ──────────────────────────────────────────────────────────
function TimelineCard({
  title,
  subtitle,
  location,
  date,
  description,
  logo,
  skills,
  roles,
  isLast = false,
  dotColor = "bg-blue-500",
  extraInfo,
}: {
  title: string;
  subtitle?: string;
  location?: string;
  date?: string;
  description?: string;
  logo?: string;
  skills?: string[];
  roles?: { subtitle: string; date: string; description: string; skills: string[] }[];
  isLast?: boolean;
  dotColor?: string;
  extraInfo?: string;
}) {
  return (
    <div className="flex gap-4 group/timeline">
      {/* Timeline spine */}
      <div className="flex flex-col items-center pt-1">
        {logo ? (
          <span className="relative flex shrink-0 overflow-hidden rounded-lg border size-12 bg-background">
            <img
              src={logo}
              alt={title}
              className="aspect-square h-full w-full object-contain p-1 rounded-lg"
              loading="lazy"
            />
          </span>
        ) : (
          <span className="relative flex shrink-0 overflow-hidden rounded-lg border size-12 bg-background dark:bg-foreground">
            <span className="flex h-full w-full items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
              {title.charAt(0)}
            </span>
          </span>
        )}
        {!isLast && <div className="w-px flex-1 bg-border my-1" />}
      </div>
      {/* Content */}
      <div className="flex-1 pb-6">
        {/* Company header */}
        <div className="mb-2">
          <h3 className="font-semibold text-base leading-tight">{title}</h3>
          {extraInfo && <p className="text-xs text-muted-foreground">{extraInfo}</p>}
          {location && <p className="text-xs text-muted-foreground">{location}</p>}
        </div>

        {/* Roles */}
        {roles && roles.length > 0 ? (
          <div className="space-y-4">
            {roles.map((role, ri) => (
              <div key={ri} className="rounded-lg border border-transparent group-hover/timeline:border-border/40 transition-all duration-300">
                <div className="flex items-start justify-between gap-x-2">
                  <h4 className="font-semibold text-sm sm:text-base leading-tight">{role.subtitle}</h4>
                  <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap shrink-0">{role.date}</span>
                </div>
                <div className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {role.description}
                </div>
                {role.skills && role.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    {role.skills.map((skill, i) => (
                      <span key={i} className="text-xs text-muted-foreground">
                        {skill}{i < role.skills.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Single role fallback */
          <div className="rounded-lg border border-transparent group-hover/timeline:border-border/40 transition-all duration-300">
            <div className="flex items-start justify-between gap-x-2">
              <h4 className="font-semibold text-sm sm:text-base leading-tight">{subtitle}</h4>
              {date && <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap shrink-0">{date}</span>}
            </div>
            {description && (
              <div className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {description}
              </div>
            )}
            {skills && skills.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                {skills.map((skill, i) => (
                  <span key={i} className="text-xs text-muted-foreground">
                    {skill}{i < skills.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dock ────────────────────────────────────────────────────────────────────
function BottomDock() {
  const { theme, toggle } = useTheme();
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX - dock.getBoundingClientRect().left);
    };
    const handleMouseLeave = () => setMouseX(null);
    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const getScale = (index: number) => {
    if (mouseX === null) return 1;
    const els = dockRef.current?.querySelectorAll("[data-dock-item]");
    if (!els) return 1;
    const el = els[index] as HTMLElement;
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    const dockRect = dockRef.current!.getBoundingClientRect();
    const center = rect.left + rect.width / 2 - dockRect.left;
    const dist = Math.abs(mouseX - center);
    if (dist > 140) return 1;
    return 1 + 0.6 * Math.pow(1 - dist / 140, 1.5);
  };

  const dockItems = [
    { icon: <HomeIcon />, href: "#hero", label: "Home" },
    { icon: <NotebookIcon />, href: "#publications", label: "Publications" },
    { type: "separator" as const },
    { icon: <GitHubIcon />, href: "https://github.com/venky-22", label: "GitHub" },
    { icon: <LinkedInIcon />, href: "https://linkedin.com/in/venkatesh-waran", label: "LinkedIn" },
    { type: "separator" as const },
    { type: "theme" as const },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 md:top-4 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background" />
      <div
        ref={dockRef}
        className="w-max p-2 rounded-full border z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 dark:bg-gray-900 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      >
        {dockItems.map((item, i) => {
          if ("type" in item && item.type === "separator") {
            return <Separator key={i} className={i === 2 ? "" : "py-2"} />;
          }
          if ("type" in item && item.type === "theme") {
            return (
              <div key={i} data-dock-item className="relative flex aspect-square cursor-pointer items-center justify-center rounded-full group/tip" style={{ width: 40, transform: `scale(${getScale(i)})` }}>
                <button
                  type="button"
                  aria-label="Toggle theme"
                  onClick={toggle}
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 rounded-full px-2"
                >
                  <SunIcon />
                  <MoonIcon />
                </button>
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 scale-90 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 pointer-events-none transition-all duration-200 group-hover/tip:scale-100 group-hover/tip:opacity-100">
                  Theme
                </span>
              </div>
            );
          }
          const dockItem = item as { icon: ReactNode; href: string; label: string };
          return (
            <div key={i} data-dock-item className="relative flex aspect-square cursor-pointer items-center justify-center rounded-full group/tip" style={{ width: 40, transform: `scale(${getScale(i)})` }}>
              <a
                href={dockItem.href}
                target={dockItem.href.startsWith("http") ? "_blank" : undefined}
                rel={dockItem.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={dockItem.label}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full size-12"
              >
                {dockItem.icon}
              </a>
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 scale-90 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 pointer-events-none transition-all duration-200 group-hover/tip:scale-100 group-hover/tip:opacity-100">
                {dockItem.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <main className="flex flex-col min-h-[100dvh] space-y-10 md:mt-10">
        {/* Hero */}
        <section id="hero" className="relative overflow-hidden">
          <div className="hero-glow" />
          <div className="mx-auto w-full max-w-2xl space-y-8 relative z-10">
            <div className="gap-2 flex justify-between">
              <div className="flex-col flex flex-1 space-y-1.5">
                <h1
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none opacity-0"
                  style={{ animation: "var(--animate-fade-in-up)" }}
                >
                  I&apos;m Venkateshwaran Mohan 👋
                </h1>
                <p
                  className="max-w-[600px] md:text-xl opacity-0"
                  style={{ animation: "var(--animate-fade-in-up)", animationDelay: "0.15s" }}
                >
                  <TypingText text="Crafting robust financial systems and intelligent applications. Let's build something amazing! 🚀" delay={800} />
                </p>
              </div>
              <span className="relative flex shrink-0 overflow-hidden rounded-full size-32 border opacity-0 hover:scale-105 transition-transform duration-300 avatar-glow" style={{ animation: "var(--animate-fade-in)", animationDelay: "0.3s" }}>
                <img
                  src="https://avatars.githubusercontent.com/u/83813738?v=4"
                  alt="Venkateshwaran Mohan"
                  className="aspect-square h-full w-full object-cover rounded-full"
                  loading="eager"
                />
              </span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <ScrollReveal>
          <div className="mx-auto max-w-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: 10, suffix: "+", label: "Research Papers" },
                { value: 9.55, suffix: "", label: "CGPA" },
                { value: 500, suffix: "+", label: "Users Impacted" },
                { value: 4, suffix: "", label: "Companies" },
              ].map((stat) => (
                <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="section-divider" />

        {/* About */}
        <ScrollReveal>
          <section id="about">
            <div className="mx-auto w-full max-w-2xl space-y-2">
              <h2 className="text-xl font-bold">About</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>
                  Graduated from{" "}
                  <a href="https://psgitech.ac.in/" target="_blank" rel="noopener noreferrer" className="underline dark:text-white text-black dark:hover:text-white/90 hover:text-gray-700 transition-colors">
                    PSG Institute of Technology and Applied Research
                  </a>{" "}
                  with a <strong className="text-foreground">Bachelor of Engineering in Computer Science</strong> in 2023. Currently contributing as an{" "}
                  <strong className="text-foreground">Application Software Engineer at Oracle</strong>, where responsibilities include designing and delivering impactful solutions such as an MCP-based release automation tool that significantly reduced backport time and integrating an ML-powered Payment Chain Classifier into Java microservices.
                </p>
                <p>
                  Experienced in managing Java/Spring Boot microservices within Oracle Banking Payments (OBPM), ensuring 99.9% SLA availability for global Tier-1 banks. Passionate about leveraging software engineering skills, including expertise in Git, Spring Boot, and MCP, to drive efficiency and innovation in financial technology systems.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <div className="section-divider" />

        {/* What I Do */}
        <ScrollReveal>
          <section id="what-i-do" className="w-full py-12">
            <div className="mx-auto w-full max-w-2xl">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm font-medium tracking-wide">
                    Services
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text">What I Do</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { icon: "M13.5 2H6.5A2.5 2.5 0 0 0 4 4.5v15A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5V7.5L13.5 2z M13 2v5h5 M10 13h4 M10 17h4 M10 9h1", title: "Backend Development", desc: "Building scalable microservices with Java, Spring Boot, and Oracle banking systems." },
                  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "Payment Systems", desc: "Designing RTGS, NEFT, IMPS, and UPI payment modules serving 100+ Tier-1 banks globally." },
                  { icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M12 2v10 M17 7l-5 5-5-5", title: "Cloud & DevOps", desc: "Deploying and managing cloud infrastructure with AWS, Docker, and Kubernetes." },
                  { icon: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z", title: "ML & AI", desc: "Developing machine learning models for payment classification and anomaly detection." },
                  { icon: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18", title: "Research", desc: "Publishing research papers in deep learning, network security, and evolvable hardware." },
                  { icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75", title: "Mentoring", desc: "Guiding students and junior developers through community outreach and volunteering." },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border/60 bg-card p-4 hover:border-border transition-all duration-300 card-glow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                      </div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <div className="section-divider" />

        {/* Skills */}
        <ScrollReveal>
          <section id="skills">
            <div className="space-y-4 py-4 md:py-8">
              <div className="mx-auto max-w-2xl text-center">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm font-medium tracking-wide mb-3">
                  Expertise
                </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text">My Skills</h2>
              </div>
              <div className="mx-auto max-w-2xl space-y-4">
                {skillCategories.map((cat, ci) => (
                  <div key={cat.label} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${cat.color}`} />
                      <span className="text-sm font-semibold text-muted-foreground">{cat.label}</span>
                    </div>
                    <div className="overflow-hidden">
                      <div className="marquee-track" style={{ animation: ci % 2 === 0 ? "var(--animate-marquee)" : "var(--animate-marquee-reverse)" }}>
                        {[...cat.skills, ...cat.skills].map((skill, si) => (
                          <span
                            key={`${skill}-${si}`}
                            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap mx-1"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <div className="section-divider" />

        {/* Projects */}
        <ScrollReveal>
          <section id="projects">
            <div className="mx-auto w-full max-w-2xl space-y-12 py-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm font-medium tracking-wide">
                    Work
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text">Featured Projects</h2>
                  <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[600px] mx-auto">
                    A selection of projects I&apos;ve built and contributed to.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {projectCards.map((project, i) => (
                  <ProjectCard key={i} {...project} />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <div className="section-divider" />

        {/* Experience & Education */}
        <ScrollReveal>
          <section id="experience" className="space-y-12 w-full py-12">
            <div className="mx-auto w-full max-w-2xl">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm font-medium tracking-wide">
                    Journey
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text">Experience &amp; Education</h2>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Experience</h3>
                <div className="space-y-4">
                  {workItems.map((item, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-card p-4 hover:border-border transition-all duration-300 card-glow">
                      <div className="flex items-start gap-3">
                        {item.logo && (
                          <span className="relative flex shrink-0 overflow-hidden rounded-lg border size-12 bg-background">
                            <img src={item.logo} alt={item.title} className="aspect-square h-full w-full object-contain p-1 rounded-lg" loading="lazy" />
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base leading-tight">{item.title}</h3>
                          {item.extraInfo && <p className="text-xs text-muted-foreground">{item.extraInfo}</p>}
                          {item.location && <p className="text-xs text-muted-foreground">{item.location}</p>}
                        </div>
                      </div>
                      <div className="mt-4 space-y-4">
                        {item.roles.map((role, ri) => (
                          <div key={ri}>
                            <div className="flex items-start justify-between gap-x-2">
                              <h4 className="font-semibold text-sm sm:text-base leading-tight">{role.subtitle}</h4>
                              <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap shrink-0">{role.date}</span>
                            </div>
                            <div className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                              {role.description}
                            </div>
                            {role.skills && role.skills.length > 0 && (
                              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                {role.skills.map((skill, si) => (
                                  <span key={si} className="text-xs text-muted-foreground">
                                    {skill}{si < role.skills.length - 1 ? "," : ""}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Education</h3>
                <div className="space-y-4">
                  {educationItems.map((item, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-card p-4 hover:border-border transition-all duration-300 card-glow">
                      <div className="flex items-start gap-3">
                        {item.logo && (
                          <span className="relative flex shrink-0 overflow-hidden rounded-lg border size-12 bg-background">
                            <img src={item.logo} alt={item.title} className="aspect-square h-full w-full object-contain p-1 rounded-lg" loading="lazy" />
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-x-2">
                            <div>
                              <h3 className="font-semibold text-base leading-tight">{item.title}</h3>
                              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                              {item.location && <p className="text-xs text-muted-foreground">{item.location}</p>}
                            </div>
                            {item.date && <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap shrink-0">{item.date}</span>}
                          </div>
                          {item.description && <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{item.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <div className="section-divider" />

        {/* Certifications */}
        <ScrollReveal>
          <section id="certifications" className="space-y-6 w-full py-6">
            <div className="mx-auto w-full max-w-2xl">
              <h3 className="text-xl font-bold">Certifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {certificationItems.map((item, i) => (
                  <div key={i} className="rounded-lg border border-border/60 bg-card p-3 hover:border-border hover:bg-accent/30 transition-all duration-300 card-glow">
                    <ResumeCard {...item} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <div className="section-divider" />

        {/* Publications */}
        <ScrollReveal>
          <section id="publications" className="space-y-12 w-full py-12">
            <div className="mx-auto w-full max-w-2xl">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm font-medium tracking-wide">
                    Research
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text">Publications</h2>
                  <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[600px] mx-auto">
                    10 research papers published in international conferences across AI, security, and systems.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <div className="space-y-3">
                  {publicationItems.map((item, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-card p-4 hover:border-border transition-all duration-300 card-glow">
                      <div className="flex items-start justify-between gap-x-2">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base leading-tight">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                          {item.location && <p className="text-xs text-muted-foreground">{item.location}</p>}
                        </div>
                        {item.date && <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap shrink-0">{item.date}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <div className="section-divider" />

        {/* Community */}
        <ScrollReveal>
          <section id="community" className="space-y-12 w-full py-12">
            <div className="mx-auto w-full max-w-2xl">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm font-medium tracking-wide">
                    Community
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text">Volunteering</h2>
                  <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[600px] mx-auto">
                    Giving back to the community through mentoring and outreach.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <div className="space-y-3">
                  {volunteerItems.map((item, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-card p-4 hover:border-border transition-all duration-300 card-glow">
                      <div className="flex items-start justify-between gap-x-2">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base leading-tight">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                        </div>
                        {item.date && <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap shrink-0">{item.date}</span>}
                      </div>
                      {item.description && <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Contact */}
        <section id="contact">
          <div className="mx-auto w-full max-w-2xl grid items-center justify-center gap-4 px-4 text-center md:px-6 py-12">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm font-medium tracking-wide">
                Contact
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text">Get in Touch</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Let&apos;s connect! Feel free to reach out and I&apos;ll get back to you as soon as I can.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href="https://linkedin.com/in/venkatesh-waran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-primary/85 hover:shadow-md active:scale-[0.97] transition-all duration-200"
                >
                  <LinkedInIcon />
                  LinkedIn
                </a>
                <a
                  href="mailto:m.venkateshwaran2207@gmail.com"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-[0.97] transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Email
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-8 mt-12">
        <div className="mx-auto max-w-2xl px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/venky-22"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <a
                href="https://linkedin.com/in/venkatesh-waran"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a
                href="mailto:m.venkateshwaran2207@gmail.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
            <div className="text-sm text-muted-foreground text-center leading-relaxed">
              &copy; {new Date().getFullYear()} Venkateshwaran Mohan.<br />
              All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <BottomDock />
      <CursorSpotlight />
      <BackToTop />
      <div className="noise-overlay" />
    </>
  );
}
