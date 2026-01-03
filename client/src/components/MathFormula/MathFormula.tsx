import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathFormulaProps {
  formula: string
  displayMode?: boolean
  className?: string
}

export default function MathFormula({ formula, displayMode = true, className = '' }: MathFormulaProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode,
          throwOnError: false,
        })
      } catch (e) {
        containerRef.current.textContent = formula
      }
    }
  }, [formula, displayMode])

  return <div ref={containerRef} className={className} />
}
