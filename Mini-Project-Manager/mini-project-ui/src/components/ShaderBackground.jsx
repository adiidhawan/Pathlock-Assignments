import React, { useEffect } from "react";

/**
 * ShaderBackground.jsx
 * - Ensures a single full-viewport background element with class "pm-full-bg"
 * - Prevents duplicate elements and removes previous mismatched ones
 * - Leaves children wrapped in .shader-content so z-index ordering is correct
 */
export default function ShaderBackground({ children }) {
  useEffect(() => {
    const ID = "pm-full-bg";
    // remove any old legacy background nodes we might have left behind
    const old = document.getElementById(ID);
    if (old) old.remove();

    // create new bg
    const bg = document.createElement("div");
    bg.id = ID;
    bg.className = "pm-full-bg";
    // insert at start so it's behind everything (z-index in CSS will keep it back)
    document.body.prepend(bg);

    // Make sure html/body backgrounds are transparent so our layer shows
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";

    return () => {
      // keep dom tidy on unmount
      const el = document.getElementById(ID);
      if (el) el.remove();
    };
  }, []);

  // shader-content ensures content stays above the background
  return <div className="shader-content">{children}</div>;
}
