"use client"

import React, { useEffect, useRef, useState } from "react"
import { MeshGradient } from "@paper-design/shaders-react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [hasShader, setHasShader] = useState(false)

  useEffect(() => {
    // quick runtime check: set hasShader true if MeshGradient mounts an element
    // (MeshGradient renders canvas/svg in DOM; we'll detect it after mount)
    setTimeout(() => {
      const found = !!document.querySelector("canvas, svg.mesh-gradient, .mesh-gradient")
      setHasShader(found)
    }, 200)

    const handleEnter = () => setIsActive(true)
    const handleLeave = () => setIsActive(false)

    const container = containerRef.current
    if (container) {
      container.addEventListener("mouseenter", handleEnter)
      container.addEventListener("mouseleave", handleLeave)
    }
    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleEnter)
        container.removeEventListener("mouseleave", handleLeave)
      }
    }
  }, [])

  // class controls opacity of the top mesh
  const overlayClass = isActive ? "shader-active" : "shader-idle"

  return (
    <div
      ref={containerRef}
      className="shader-root min-h-screen bg-black relative overflow-hidden"
      data-shader-present={hasShader ? "true" : "false"}
    >
      {/* Primary mesh behind everything (z-index: -1) */}
      <div className="mesh-wrap mesh-primary" aria-hidden>
        <MeshGradient
          className="mesh-gradient mesh-primary-canvas"
          colors={["#000000", "#5a0000", "#220000", "#0f0000", "#4a0000"]}
          speed={0.25}
        />
      </div>

      {/* Secondary mesh sits above primary but still behind content; we toggle opacity via class */}
      <div className={`mesh-wrap mesh-secondary ${overlayClass}`} aria-hidden>
        <MeshGradient
          className="mesh-gradient mesh-secondary-canvas"
          colors={["#000000", "#ff3b3b", "#220000", "#000000"]}
          speed={0.14}
        />
      </div>

      {/* Fallback decorative gradient (in case MeshGradient fails) */}
      <div className="fallback-gradient" aria-hidden />

      {/* Page content */}
      <div className="shader-content relative z-10">{children}</div>
    </div>
  )
}
