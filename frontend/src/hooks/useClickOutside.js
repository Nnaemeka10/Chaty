import { useEffect } from "react";

function useClickOutside(ref, callback, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    function handleMouseDown(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        callback();
      }
    }

    document.addEventListener("pointerdown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, callback, enabled]);
}

export default useClickOutside;