import { createSignal, onMount } from "solid-js";

type Theme = "light" | "dark";
const KEY = "newshub-theme";

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

// Follows the system setting until the reader picks a theme; the choice is remembered on this device.
// index.html sets data-theme before first paint, so there is no flash of the wrong theme.
export default function ThemeToggle() {
  const system = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const [theme, setTheme] = createSignal<Theme>("light");

  onMount(() => setTheme(stored() ?? system()));

  const toggle = () => {
    const next: Theme = theme() === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // private mode: the choice lasts until reload
    }
  };

  return (
    <button
      type="button"
      class="icon-button"
      onClick={toggle}
      aria-label={theme() === "dark" ? "Byt till ljust läge" : "Byt till mörkt läge"}
    >
      {theme() === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
