
import * as React from "react"

export function useScreenSize() {
  const [size, setSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  React.useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = size.width < 768
  const isTablet = size.width >= 768 && size.width < 1024
  const isDesktop = size.width >= 1024

  return {
    width: size.width,
    height: size.height,
    isMobile,
    isTablet,
    isDesktop
  }
}
