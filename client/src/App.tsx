import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './experiments/Home'

// lazy 加载失败时自动重试（网络不稳定的手机端常见）
function lazyRetry<T extends { default: React.ComponentType }>(
  fn: () => Promise<T>,
  retries = 2,
): React.LazyExoticComponent<T['default']> {
  return lazy(() => {
    const attempt = (remaining: number): Promise<T> =>
      fn().catch((err) => {
        if (remaining <= 0) throw err
        return new Promise<T>((resolve) =>
          setTimeout(() => resolve(attempt(remaining - 1)), 1000)
        )
      })
    return attempt(retries)
  })
}

const FourierExperiment = lazyRetry(() => import('./experiments/fourier/FourierExperiment'))
const TrigExperiment = lazyRetry(() => import('./experiments/trigonometry/TrigExperiment'))
const CalculusExperiment = lazyRetry(() => import('./experiments/calculus/CalculusExperiment'))
const LinearAlgebraExperiment = lazyRetry(() => import('./experiments/linear-algebra/LinearAlgebraExperiment'))
const ComplexExperiment = lazyRetry(() => import('./experiments/complex/ComplexExperiment'))
const TaylorExperiment = lazyRetry(() => import('./experiments/taylor/TaylorExperiment'))
const PolarExperiment = lazyRetry(() => import('./experiments/polar/PolarExperiment'))
const ParametricExperiment = lazyRetry(() => import('./experiments/parametric/ParametricExperiment'))
const ODEExperiment = lazyRetry(() => import('./experiments/ode/ODEExperiment'))
const ProbabilityExperiment = lazyRetry(() => import('./experiments/probability/ProbabilityExperiment'))
const CLTExperiment = lazyRetry(() => import('./experiments/clt/CLTExperiment'))
const MonteCarloExperiment = lazyRetry(() => import('./experiments/monte-carlo/MonteCarloExperiment'))
const FractalExperiment = lazyRetry(() => import('./experiments/fractal/FractalExperiment'))
const GoldenRatioExperiment = lazyRetry(() => import('./experiments/golden-ratio/GoldenRatioExperiment'))
const NewtonMethodExperiment = lazyRetry(() => import('./experiments/newton-method/NewtonMethodExperiment'))
const GradientDescentExperiment = lazyRetry(() => import('./experiments/gradient-descent/GradientDescentExperiment'))
const FourierDrawingExperiment = lazyRetry(() => import('./experiments/fourier-drawing/FourierDrawingExperiment'))
const BayesExperiment = lazyRetry(() => import('./experiments/bayes/BayesExperiment'))
const GraphTheoryExperiment = lazyRetry(() => import('./experiments/graph-theory/GraphTheoryExperiment'))
const VectorFieldExperiment = lazyRetry(() => import('./experiments/vector-field/VectorFieldExperiment'))
const WaveEquationExperiment = lazyRetry(() => import('./experiments/wave-equation/WaveEquationExperiment'))
const ChaosExperiment = lazyRetry(() => import('./experiments/chaos/ChaosExperiment'))
const NumberTheoryExperiment = lazyRetry(() => import('./experiments/number-theory/NumberTheoryExperiment'))
const SetTheoryExperiment = lazyRetry(() => import('./experiments/set-theory/SetTheoryExperiment'))
const MatrixDecompositionExperiment = lazyRetry(() => import('./experiments/matrix-decomposition/MatrixDecompositionExperiment'))
const SignalProcessingExperiment = lazyRetry(() => import('./experiments/signal-processing/SignalProcessingExperiment'))
const GameTheoryExperiment = lazyRetry(() => import('./experiments/game-theory/GameTheoryExperiment'))
const RegressionExperiment = lazyRetry(() => import('./experiments/regression/RegressionExperiment'))
const OptimizationExperiment = lazyRetry(() => import('./experiments/optimization/OptimizationExperiment'))
const NumericalIntegrationExperiment = lazyRetry(() => import('./experiments/numerical-integration/NumericalIntegrationExperiment'))
const InterpolationExperiment = lazyRetry(() => import('./experiments/interpolation/InterpolationExperiment'))
const MarkovChainExperiment = lazyRetry(() => import('./experiments/markov-chain/MarkovChainExperiment'))
const FourierSeriesExperiment = lazyRetry(() => import('./experiments/fourier-series/FourierSeriesExperiment'))
const PCAExperiment = lazyRetry(() => import('./experiments/pca/PCAExperiment'))
const HeatEquationExperiment = lazyRetry(() => import('./experiments/heat-equation/HeatEquationExperiment'))
const RandomWalkExperiment = lazyRetry(() => import('./experiments/random-walk/RandomWalkExperiment'))
const BezierExperiment = lazyRetry(() => import('./experiments/bezier/BezierExperiment'))
const BasicArithmeticExperiment = lazyRetry(() => import('./experiments/basic-arithmetic/BasicArithmeticExperiment'))
const FractionsExperiment = lazyRetry(() => import('./experiments/fractions/FractionsExperiment'))
const GeometryShapesExperiment = lazyRetry(() => import('./experiments/geometry-shapes/GeometryShapesExperiment'))
const LinearFunctionExperiment = lazyRetry(() => import('./experiments/linear-function/LinearFunctionExperiment'))
const QuadraticFunctionExperiment = lazyRetry(() => import('./experiments/quadratic-function/QuadraticFunctionExperiment'))
const PythagoreanExperiment = lazyRetry(() => import('./experiments/pythagorean/PythagoreanExperiment'))
const ConicSectionsExperiment = lazyRetry(() => import('./experiments/conic-sections/ConicSectionsExperiment'))
const PermutationCombinationExperiment = lazyRetry(() => import('./experiments/permutation-combination/PermutationCombinationExperiment'))
const LaplaceExperiment = lazyRetry(() => import('./experiments/laplace/LaplaceExperiment'))
const DifferentialGeometryExperiment = lazyRetry(() => import('./experiments/differential-geometry/DifferentialGeometryExperiment'))
const PDEExperiment = lazyRetry(() => import('./experiments/pde/PDEExperiment'))
const NumericalAnalysisExperiment = lazyRetry(() => import('./experiments/numerical-analysis/NumericalAnalysisExperiment'))
const CryptographyExperiment = lazyRetry(() => import('./experiments/cryptography/CryptographyExperiment'))
const GameOfLifeExperiment = lazyRetry(() => import('./experiments/game-of-life/GameOfLifeExperiment'))
const EulerIdentityExperiment = lazyRetry(() => import('./experiments/euler-identity/EulerIdentityExperiment'))
const ThreeBodyExperiment = lazyRetry(() => import('./experiments/three-body/ThreeBodyExperiment'))
const ReactionDiffusionExperiment = lazyRetry(() => import('./experiments/reaction-diffusion/ReactionDiffusionExperiment'))
const MobiusExperiment = lazyRetry(() => import('./experiments/mobius/MobiusExperiment'))
const BugAdminPage = lazyRetry(() => import('./pages/BugAdminPage'))
const ValentineMobile = lazyRetry(() => import('./components/ValentineMobile/ValentineMobile'))

const Loading = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
    <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
    <span className="text-sm">加载中...</span>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="fourier" element={<FourierExperiment />} />
            <Route path="trigonometry" element={<TrigExperiment />} />
            <Route path="calculus" element={<CalculusExperiment />} />
            <Route path="linear-algebra" element={<LinearAlgebraExperiment />} />
            <Route path="complex" element={<ComplexExperiment />} />
            <Route path="taylor" element={<TaylorExperiment />} />
            <Route path="polar" element={<PolarExperiment />} />
            <Route path="parametric" element={<ParametricExperiment />} />
            <Route path="ode" element={<ODEExperiment />} />
            <Route path="probability" element={<ProbabilityExperiment />} />
            <Route path="clt" element={<CLTExperiment />} />
            <Route path="monte-carlo" element={<MonteCarloExperiment />} />
            <Route path="fractal" element={<FractalExperiment />} />
            <Route path="golden-ratio" element={<GoldenRatioExperiment />} />
            <Route path="newton-method" element={<NewtonMethodExperiment />} />
            <Route path="gradient-descent" element={<GradientDescentExperiment />} />
            <Route path="fourier-drawing" element={<FourierDrawingExperiment />} />
            <Route path="bayes" element={<BayesExperiment />} />
            <Route path="graph-theory" element={<GraphTheoryExperiment />} />
            <Route path="vector-field" element={<VectorFieldExperiment />} />
            <Route path="wave-equation" element={<WaveEquationExperiment />} />
            <Route path="chaos" element={<ChaosExperiment />} />
            <Route path="number-theory" element={<NumberTheoryExperiment />} />
            <Route path="set-theory" element={<SetTheoryExperiment />} />
            <Route path="matrix-decomposition" element={<MatrixDecompositionExperiment />} />
            <Route path="signal-processing" element={<SignalProcessingExperiment />} />
            <Route path="game-theory" element={<GameTheoryExperiment />} />
            <Route path="regression" element={<RegressionExperiment />} />
            <Route path="optimization" element={<OptimizationExperiment />} />
            <Route path="numerical-integration" element={<NumericalIntegrationExperiment />} />
            <Route path="interpolation" element={<InterpolationExperiment />} />
            <Route path="markov-chain" element={<MarkovChainExperiment />} />
            <Route path="fourier-series" element={<FourierSeriesExperiment />} />
            <Route path="pca" element={<PCAExperiment />} />
            <Route path="heat-equation" element={<HeatEquationExperiment />} />
            <Route path="random-walk" element={<RandomWalkExperiment />} />
            <Route path="bezier" element={<BezierExperiment />} />
            <Route path="basic-arithmetic" element={<BasicArithmeticExperiment />} />
            <Route path="fractions" element={<FractionsExperiment />} />
            <Route path="geometry-shapes" element={<GeometryShapesExperiment />} />
            <Route path="linear-function" element={<LinearFunctionExperiment />} />
            <Route path="quadratic-function" element={<QuadraticFunctionExperiment />} />
            <Route path="pythagorean" element={<PythagoreanExperiment />} />
            <Route path="conic-sections" element={<ConicSectionsExperiment />} />
            <Route path="permutation-combination" element={<PermutationCombinationExperiment />} />
            <Route path="laplace" element={<LaplaceExperiment />} />
            <Route path="differential-geometry" element={<DifferentialGeometryExperiment />} />
            <Route path="pde" element={<PDEExperiment />} />
            <Route path="numerical-analysis" element={<NumericalAnalysisExperiment />} />
            <Route path="cryptography" element={<CryptographyExperiment />} />
            <Route path="game-of-life" element={<GameOfLifeExperiment />} />
            <Route path="euler-identity" element={<EulerIdentityExperiment />} />
            <Route path="three-body" element={<ThreeBodyExperiment />} />
            <Route path="reaction-diffusion" element={<ReactionDiffusionExperiment />} />
            <Route path="mobius" element={<MobiusExperiment />} />
          </Route>
          <Route path="/admin" element={<BugAdminPage />} />
          <Route path="/valentine" element={<Suspense fallback={<div className="fixed inset-0 bg-[#0a050f]" />}><ValentineMobile /></Suspense>} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
