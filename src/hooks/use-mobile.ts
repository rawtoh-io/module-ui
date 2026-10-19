import * as React from "react"

const MOBILE_BREAKPOINT = 768

function useBelow(width: number) {
  const [below, setBelow] = React.useState(
    () => typeof window !== "undefined" && window.innerWidth < width
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${width - 1}px)`)
    const onChange = () => {
      setBelow(window.innerWidth < width)
    }
    mql.addEventListener("change", onChange)
    setBelow(window.innerWidth < width)
    return () => mql.removeEventListener("change", onChange)
  }, [width])

  return below
}

/** Sidebar behaviour: off-canvas below 768px. */
export function useIsMobile() {
  return useBelow(MOBILE_BREAKPOINT)
}
