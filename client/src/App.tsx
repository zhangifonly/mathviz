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
const CycloidExperiment = lazyRetry(() => import('./experiments/cycloid/CycloidExperiment'))
const LissajousExperiment = lazyRetry(() => import('./experiments/lissajous/LissajousExperiment'))
const UlamSpiralExperiment = lazyRetry(() => import('./experiments/ulam-spiral/UlamSpiralExperiment'))
const PascalTriangleExperiment = lazyRetry(() => import('./experiments/pascal-triangle/PascalTriangleExperiment'))
const VoronoiExperiment = lazyRetry(() => import('./experiments/voronoi/VoronoiExperiment'))
const LSystemExperiment = lazyRetry(() => import('./experiments/l-system/LSystemExperiment'))
const EvenOddExperiment = lazyRetry(() => import('./experiments/even-odd/EvenOddExperiment'))
const RomanNumeralsExperiment = lazyRetry(() => import('./experiments/roman-numerals/RomanNumeralsExperiment'))
const SymmetryExperiment = lazyRetry(() => import('./experiments/symmetry/SymmetryExperiment'))
const TangramExperiment = lazyRetry(() => import('./experiments/tangram/TangramExperiment'))
const ClockAnglesExperiment = lazyRetry(() => import('./experiments/clock-angles/ClockAnglesExperiment'))
const InequalitiesExperiment = lazyRetry(() => import('./experiments/inequalities/InequalitiesExperiment'))
const LinearSystemExperiment = lazyRetry(() => import('./experiments/linear-system/LinearSystemExperiment'))
const SimilarTrianglesExperiment = lazyRetry(() => import('./experiments/similar-triangles/SimilarTrianglesExperiment'))
const CircleGeometryExperiment = lazyRetry(() => import('./experiments/circle-geometry/CircleGeometryExperiment'))
const StatsBasicsExperiment = lazyRetry(() => import('./experiments/stats-basics/StatsBasicsExperiment'))
const AbsoluteValueExperiment = lazyRetry(() => import('./experiments/absolute-value/AbsoluteValueExperiment'))
const SequencesExperiment = lazyRetry(() => import('./experiments/sequences/SequencesExperiment'))
const ExponentialLogExperiment = lazyRetry(() => import('./experiments/exponential-log/ExponentialLogExperiment'))
const MatrixTransformExperiment = lazyRetry(() => import('./experiments/matrix-transform/MatrixTransformExperiment'))
const DotCrossProductExperiment = lazyRetry(() => import('./experiments/dot-cross-product/DotCrossProductExperiment'))
const ParabolaOpticsExperiment = lazyRetry(() => import('./experiments/parabola-optics/ParabolaOpticsExperiment'))
const SineSuperpositionExperiment = lazyRetry(() => import('./experiments/sine-superposition/SineSuperpositionExperiment'))
const CombinatorialProofExperiment = lazyRetry(() => import('./experiments/combinatorial-proof/CombinatorialProofExperiment'))
const ModularArithmeticExperiment = lazyRetry(() => import('./experiments/modular-arithmetic/ModularArithmeticExperiment'))
const ContinuedFractionExperiment = lazyRetry(() => import('./experiments/continued-fraction/ContinuedFractionExperiment'))
const EpidemicSirExperiment = lazyRetry(() => import('./experiments/epidemic-sir/EpidemicSirExperiment'))
const EigenVisualizationExperiment = lazyRetry(() => import('./experiments/eigen-visualization/EigenVisualizationExperiment'))
const SvdExperiment = lazyRetry(() => import('./experiments/svd/SvdExperiment'))
const GramSchmidtExperiment = lazyRetry(() => import('./experiments/gram-schmidt/GramSchmidtExperiment'))
const LagrangeMultiplierExperiment = lazyRetry(() => import('./experiments/lagrange-multiplier/LagrangeMultiplierExperiment'))
const GreenTheoremExperiment = lazyRetry(() => import('./experiments/green-theorem/GreenTheoremExperiment'))
const ResidueTheoremExperiment = lazyRetry(() => import('./experiments/residue-theorem/ResidueTheoremExperiment'))
const PowerSeriesExperiment = lazyRetry(() => import('./experiments/power-series/PowerSeriesExperiment'))
const GaussianProcessExperiment = lazyRetry(() => import('./experiments/gaussian-process/GaussianProcessExperiment'))
const KalmanFilterExperiment = lazyRetry(() => import('./experiments/kalman-filter/KalmanFilterExperiment'))
const SimulatedAnnealingExperiment = lazyRetry(() => import('./experiments/simulated-annealing/SimulatedAnnealingExperiment'))
const MandelbrotJuliaExperiment = lazyRetry(() => import('./experiments/mandelbrot-julia/MandelbrotJuliaExperiment'))
const DoublePendulumExperiment = lazyRetry(() => import('./experiments/double-pendulum/DoublePendulumExperiment'))
const LorenzAttractorExperiment = lazyRetry(() => import('./experiments/lorenz-attractor/LorenzAttractorExperiment'))
const NbodySimulationExperiment = lazyRetry(() => import('./experiments/nbody-simulation/NbodySimulationExperiment'))
const PercolationExperiment = lazyRetry(() => import('./experiments/percolation/PercolationExperiment'))
const CellularAutomataExperiment = lazyRetry(() => import('./experiments/cellular-automata/CellularAutomataExperiment'))
const KnotTheoryExperiment = lazyRetry(() => import('./experiments/knot-theory/KnotTheoryExperiment'))
const WaveletExperiment = lazyRetry(() => import('./experiments/wavelet/WaveletExperiment'))
const SieveEratosthenesExperiment = lazyRetry(() => import('./experiments/sieve-eratosthenes/SieveEratosthenesExperiment'))
const MagicSquareExperiment = lazyRetry(() => import('./experiments/magic-square/MagicSquareExperiment'))
const TowerOfHanoiExperiment = lazyRetry(() => import('./experiments/tower-of-hanoi/TowerOfHanoiExperiment'))
const PigeonholeExperiment = lazyRetry(() => import('./experiments/pigeonhole/PigeonholeExperiment'))
const TriangleCentersExperiment = lazyRetry(() => import('./experiments/triangle-centers/TriangleCentersExperiment'))
const NumberBasesExperiment = lazyRetry(() => import('./experiments/number-bases/NumberBasesExperiment'))
const PythagorasTreeExperiment = lazyRetry(() => import('./experiments/pythagoras-tree/PythagorasTreeExperiment'))
const TessellationExperiment = lazyRetry(() => import('./experiments/tessellation/TessellationExperiment'))
const PerfectNumbersExperiment = lazyRetry(() => import('./experiments/perfect-numbers/PerfectNumbersExperiment'))
const CollatzExperiment = lazyRetry(() => import('./experiments/collatz/CollatzExperiment'))
const PrimeFactorizationExperiment = lazyRetry(() => import('./experiments/prime-factorization/PrimeFactorizationExperiment'))
const FibonacciNatureExperiment = lazyRetry(() => import('./experiments/fibonacci-nature/FibonacciNatureExperiment'))
const DiceProbabilityExperiment = lazyRetry(() => import('./experiments/dice-probability/DiceProbabilityExperiment'))
const NinePointCircleExperiment = lazyRetry(() => import('./experiments/nine-point-circle/NinePointCircleExperiment'))
const EulerLineExperiment = lazyRetry(() => import('./experiments/euler-line/EulerLineExperiment'))
const InversiveGeometryExperiment = lazyRetry(() => import('./experiments/inversive-geometry/InversiveGeometryExperiment'))
const PoincareDiskExperiment = lazyRetry(() => import('./experiments/poincare-disk/PoincareDiskExperiment'))
const SphericalGeometryExperiment = lazyRetry(() => import('./experiments/spherical-geometry/SphericalGeometryExperiment'))
const ConvexHullExperiment = lazyRetry(() => import('./experiments/convex-hull/ConvexHullExperiment'))
const DelaunayTriangulationExperiment = lazyRetry(() => import('./experiments/delaunay-triangulation/DelaunayTriangulationExperiment'))
const ApollonianGasketExperiment = lazyRetry(() => import('./experiments/apollonian-gasket/ApollonianGasketExperiment'))
const PickTheoremExperiment = lazyRetry(() => import('./experiments/pick-theorem/PickTheoremExperiment'))
const ReuleauxExperiment = lazyRetry(() => import('./experiments/reuleaux/ReuleauxExperiment'))
const CirclePackingExperiment = lazyRetry(() => import('./experiments/circle-packing/CirclePackingExperiment'))
const SteinerChainExperiment = lazyRetry(() => import('./experiments/steiner-chain/SteinerChainExperiment'))
const PolynomialRootsExperiment = lazyRetry(() => import('./experiments/polynomial-roots/PolynomialRootsExperiment'))
const VietaFormulasExperiment = lazyRetry(() => import('./experiments/vieta-formulas/VietaFormulasExperiment'))
const BinomialTheoremExperiment = lazyRetry(() => import('./experiments/binomial-theorem/BinomialTheoremExperiment'))
const InverseFunctionExperiment = lazyRetry(() => import('./experiments/inverse-function/InverseFunctionExperiment'))
const CompositeFunctionExperiment = lazyRetry(() => import('./experiments/composite-function/CompositeFunctionExperiment'))
const PartialFractionsExperiment = lazyRetry(() => import('./experiments/partial-fractions/PartialFractionsExperiment'))
const RationalAsymptotesExperiment = lazyRetry(() => import('./experiments/rational-asymptotes/RationalAsymptotesExperiment'))
const PiecewiseFunctionExperiment = lazyRetry(() => import('./experiments/piecewise-function/PiecewiseFunctionExperiment'))
const LogarithmSpiralExperiment = lazyRetry(() => import('./experiments/logarithm-spiral/LogarithmSpiralExperiment'))
const FunctionTransformExperiment = lazyRetry(() => import('./experiments/function-transform/FunctionTransformExperiment'))
const EuclideanAlgorithmExperiment = lazyRetry(() => import('./experiments/euclidean-algorithm/EuclideanAlgorithmExperiment'))
const ChineseRemainderExperiment = lazyRetry(() => import('./experiments/chinese-remainder/ChineseRemainderExperiment'))
const QuadraticResidueExperiment = lazyRetry(() => import('./experiments/quadratic-residue/QuadraticResidueExperiment'))
const GaussianIntegersExperiment = lazyRetry(() => import('./experiments/gaussian-integers/GaussianIntegersExperiment'))
const IntegerPartitionExperiment = lazyRetry(() => import('./experiments/integer-partition/IntegerPartitionExperiment'))
const PellEquationExperiment = lazyRetry(() => import('./experiments/pell-equation/PellEquationExperiment'))
const PrimeCountingExperiment = lazyRetry(() => import('./experiments/prime-counting/PrimeCountingExperiment'))
const DigitalRootExperiment = lazyRetry(() => import('./experiments/digital-root/DigitalRootExperiment'))
const EpsilonDeltaExperiment = lazyRetry(() => import('./experiments/epsilon-delta/EpsilonDeltaExperiment'))
const MeanValueTheoremExperiment = lazyRetry(() => import('./experiments/mean-value-theorem/MeanValueTheoremExperiment'))
const RiemannSumExperiment = lazyRetry(() => import('./experiments/riemann-sum/RiemannSumExperiment'))
const SolidOfRevolutionExperiment = lazyRetry(() => import('./experiments/solid-of-revolution/SolidOfRevolutionExperiment'))
const ArcLengthCurvatureExperiment = lazyRetry(() => import('./experiments/arc-length-curvature/ArcLengthCurvatureExperiment'))
const SeriesConvergenceExperiment = lazyRetry(() => import('./experiments/series-convergence/SeriesConvergenceExperiment'))
const ImproperIntegralExperiment = lazyRetry(() => import('./experiments/improper-integral/ImproperIntegralExperiment'))
const DeterminantGeometryExperiment = lazyRetry(() => import('./experiments/determinant-geometry/DeterminantGeometryExperiment'))
const KernelImageExperiment = lazyRetry(() => import('./experiments/kernel-image/KernelImageExperiment'))
const OrthogonalProjectionExperiment = lazyRetry(() => import('./experiments/orthogonal-projection/OrthogonalProjectionExperiment'))
const LeastSquaresExperiment = lazyRetry(() => import('./experiments/least-squares/LeastSquaresExperiment'))
const QuadraticFormExperiment = lazyRetry(() => import('./experiments/quadratic-form/QuadraticFormExperiment'))
const SpectralTheoremExperiment = lazyRetry(() => import('./experiments/spectral-theorem/SpectralTheoremExperiment'))
const LawLargeNumbersExperiment = lazyRetry(() => import('./experiments/law-large-numbers/LawLargeNumbersExperiment'))
const PoissonProcessExperiment = lazyRetry(() => import('./experiments/poisson-process/PoissonProcessExperiment'))
const BrownianMotionExperiment = lazyRetry(() => import('./experiments/brownian-motion/BrownianMotionExperiment'))
const MontyHallExperiment = lazyRetry(() => import('./experiments/monty-hall/MontyHallExperiment'))
const BirthdayParadoxExperiment = lazyRetry(() => import('./experiments/birthday-paradox/BirthdayParadoxExperiment'))
const HypothesisTestingExperiment = lazyRetry(() => import('./experiments/hypothesis-testing/HypothesisTestingExperiment'))
const ConfidenceIntervalExperiment = lazyRetry(() => import('./experiments/confidence-interval/ConfidenceIntervalExperiment'))
const MaxLikelihoodExperiment = lazyRetry(() => import('./experiments/max-likelihood/MaxLikelihoodExperiment'))
const GaussianMixtureExperiment = lazyRetry(() => import('./experiments/gaussian-mixture/GaussianMixtureExperiment'))
const HiddenMarkovExperiment = lazyRetry(() => import('./experiments/hidden-markov/HiddenMarkovExperiment'))
const MultipleIntegralExperiment = lazyRetry(() => import('./experiments/multiple-integral/MultipleIntegralExperiment'))
const LineIntegralExperiment = lazyRetry(() => import('./experiments/line-integral/LineIntegralExperiment'))
const DivergenceCurlExperiment = lazyRetry(() => import('./experiments/divergence-curl/DivergenceCurlExperiment'))
const StokesTheoremExperiment = lazyRetry(() => import('./experiments/stokes-theorem/StokesTheoremExperiment'))
const PartialDerivativeExperiment = lazyRetry(() => import('./experiments/partial-derivative/PartialDerivativeExperiment'))
const DirectionalDerivativeExperiment = lazyRetry(() => import('./experiments/directional-derivative/DirectionalDerivativeExperiment'))
const JacobianExperiment = lazyRetry(() => import('./experiments/jacobian/JacobianExperiment'))
const VectorCalculusFieldExperiment = lazyRetry(() => import('./experiments/vector-calculus-field/VectorCalculusFieldExperiment'))
const LaplacianExperiment = lazyRetry(() => import('./experiments/laplacian/LaplacianExperiment'))
const DijkstraExperiment = lazyRetry(() => import('./experiments/dijkstra/DijkstraExperiment'))
const NetworkFlowExperiment = lazyRetry(() => import('./experiments/network-flow/NetworkFlowExperiment'))
const GraphColoringExperiment = lazyRetry(() => import('./experiments/graph-coloring/GraphColoringExperiment'))
const EulerHamiltonPathExperiment = lazyRetry(() => import('./experiments/euler-hamilton-path/EulerHamiltonPathExperiment'))
const SortingAlgorithmsExperiment = lazyRetry(() => import('./experiments/sorting-algorithms/SortingAlgorithmsExperiment'))
const BfsDfsExperiment = lazyRetry(() => import('./experiments/bfs-dfs/BfsDfsExperiment'))
const DynamicProgrammingExperiment = lazyRetry(() => import('./experiments/dynamic-programming/DynamicProgrammingExperiment'))
const DivideConquerExperiment = lazyRetry(() => import('./experiments/divide-conquer/DivideConquerExperiment'))
const HuffmanCodingExperiment = lazyRetry(() => import('./experiments/huffman-coding/HuffmanCodingExperiment'))
const CatalanNumbersExperiment = lazyRetry(() => import('./experiments/catalan-numbers/CatalanNumbersExperiment'))
const GeneratingFunctionsExperiment = lazyRetry(() => import('./experiments/generating-functions/GeneratingFunctionsExperiment'))
const MinimumSpanningTreeExperiment = lazyRetry(() => import('./experiments/minimum-spanning-tree/MinimumSpanningTreeExperiment'))
const LogisticBifurcationExperiment = lazyRetry(() => import('./experiments/logistic-bifurcation/LogisticBifurcationExperiment'))
const PhasePortraitExperiment = lazyRetry(() => import('./experiments/phase-portrait/PhasePortraitExperiment'))
const LimitCycleExperiment = lazyRetry(() => import('./experiments/limit-cycle/LimitCycleExperiment'))
const LotkaVolterraExperiment = lazyRetry(() => import('./experiments/lotka-volterra/LotkaVolterraExperiment'))
const PendulumPhaseExperiment = lazyRetry(() => import('./experiments/pendulum-phase/PendulumPhaseExperiment'))
const KeplerOrbitExperiment = lazyRetry(() => import('./experiments/kepler-orbit/KeplerOrbitExperiment'))
const VibratingStringExperiment = lazyRetry(() => import('./experiments/vibrating-string/VibratingStringExperiment'))
const PoincareSectionExperiment = lazyRetry(() => import('./experiments/poincare-section/PoincareSectionExperiment'))
const EulerCharacteristicExperiment = lazyRetry(() => import('./experiments/euler-characteristic/EulerCharacteristicExperiment'))
const TorusKleinExperiment = lazyRetry(() => import('./experiments/torus-klein/TorusKleinExperiment'))
const PerceptronExperiment = lazyRetry(() => import('./experiments/perceptron/PerceptronExperiment'))
const KmeansExperiment = lazyRetry(() => import('./experiments/kmeans/KmeansExperiment'))
const NeuralNetworkForwardExperiment = lazyRetry(() => import('./experiments/neural-network-forward/NeuralNetworkForwardExperiment'))
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
            <Route path="cycloid" element={<CycloidExperiment />} />
            <Route path="lissajous" element={<LissajousExperiment />} />
            <Route path="ulam-spiral" element={<UlamSpiralExperiment />} />
            <Route path="pascal-triangle" element={<PascalTriangleExperiment />} />
            <Route path="voronoi" element={<VoronoiExperiment />} />
            <Route path="l-system" element={<LSystemExperiment />} />
            <Route path="even-odd" element={<EvenOddExperiment />} />
            <Route path="roman-numerals" element={<RomanNumeralsExperiment />} />
            <Route path="symmetry" element={<SymmetryExperiment />} />
            <Route path="tangram" element={<TangramExperiment />} />
            <Route path="clock-angles" element={<ClockAnglesExperiment />} />
            <Route path="inequalities" element={<InequalitiesExperiment />} />
            <Route path="linear-system" element={<LinearSystemExperiment />} />
            <Route path="similar-triangles" element={<SimilarTrianglesExperiment />} />
            <Route path="circle-geometry" element={<CircleGeometryExperiment />} />
            <Route path="stats-basics" element={<StatsBasicsExperiment />} />
            <Route path="absolute-value" element={<AbsoluteValueExperiment />} />
            <Route path="sequences" element={<SequencesExperiment />} />
            <Route path="exponential-log" element={<ExponentialLogExperiment />} />
            <Route path="matrix-transform" element={<MatrixTransformExperiment />} />
            <Route path="dot-cross-product" element={<DotCrossProductExperiment />} />
            <Route path="parabola-optics" element={<ParabolaOpticsExperiment />} />
            <Route path="sine-superposition" element={<SineSuperpositionExperiment />} />
            <Route path="combinatorial-proof" element={<CombinatorialProofExperiment />} />
            <Route path="modular-arithmetic" element={<ModularArithmeticExperiment />} />
            <Route path="continued-fraction" element={<ContinuedFractionExperiment />} />
            <Route path="epidemic-sir" element={<EpidemicSirExperiment />} />
            <Route path="eigen-visualization" element={<EigenVisualizationExperiment />} />
            <Route path="svd" element={<SvdExperiment />} />
            <Route path="gram-schmidt" element={<GramSchmidtExperiment />} />
            <Route path="lagrange-multiplier" element={<LagrangeMultiplierExperiment />} />
            <Route path="green-theorem" element={<GreenTheoremExperiment />} />
            <Route path="residue-theorem" element={<ResidueTheoremExperiment />} />
            <Route path="power-series" element={<PowerSeriesExperiment />} />
            <Route path="gaussian-process" element={<GaussianProcessExperiment />} />
            <Route path="kalman-filter" element={<KalmanFilterExperiment />} />
            <Route path="simulated-annealing" element={<SimulatedAnnealingExperiment />} />
            <Route path="mandelbrot-julia" element={<MandelbrotJuliaExperiment />} />
            <Route path="double-pendulum" element={<DoublePendulumExperiment />} />
            <Route path="lorenz-attractor" element={<LorenzAttractorExperiment />} />
            <Route path="nbody-simulation" element={<NbodySimulationExperiment />} />
            <Route path="percolation" element={<PercolationExperiment />} />
            <Route path="cellular-automata" element={<CellularAutomataExperiment />} />
            <Route path="knot-theory" element={<KnotTheoryExperiment />} />
            <Route path="wavelet" element={<WaveletExperiment />} />
            <Route path="sieve-eratosthenes" element={<SieveEratosthenesExperiment />} />
            <Route path="magic-square" element={<MagicSquareExperiment />} />
            <Route path="tower-of-hanoi" element={<TowerOfHanoiExperiment />} />
            <Route path="pigeonhole" element={<PigeonholeExperiment />} />
            <Route path="triangle-centers" element={<TriangleCentersExperiment />} />
            <Route path="number-bases" element={<NumberBasesExperiment />} />
            <Route path="pythagoras-tree" element={<PythagorasTreeExperiment />} />
            <Route path="tessellation" element={<TessellationExperiment />} />
            <Route path="perfect-numbers" element={<PerfectNumbersExperiment />} />
            <Route path="collatz" element={<CollatzExperiment />} />
            <Route path="prime-factorization" element={<PrimeFactorizationExperiment />} />
            <Route path="fibonacci-nature" element={<FibonacciNatureExperiment />} />
            <Route path="dice-probability" element={<DiceProbabilityExperiment />} />
            <Route path="nine-point-circle" element={<NinePointCircleExperiment />} />
            <Route path="euler-line" element={<EulerLineExperiment />} />
            <Route path="inversive-geometry" element={<InversiveGeometryExperiment />} />
            <Route path="poincare-disk" element={<PoincareDiskExperiment />} />
            <Route path="spherical-geometry" element={<SphericalGeometryExperiment />} />
            <Route path="convex-hull" element={<ConvexHullExperiment />} />
            <Route path="delaunay-triangulation" element={<DelaunayTriangulationExperiment />} />
            <Route path="apollonian-gasket" element={<ApollonianGasketExperiment />} />
            <Route path="pick-theorem" element={<PickTheoremExperiment />} />
            <Route path="reuleaux" element={<ReuleauxExperiment />} />
            <Route path="circle-packing" element={<CirclePackingExperiment />} />
            <Route path="steiner-chain" element={<SteinerChainExperiment />} />
            <Route path="polynomial-roots" element={<PolynomialRootsExperiment />} />
            <Route path="vieta-formulas" element={<VietaFormulasExperiment />} />
            <Route path="binomial-theorem" element={<BinomialTheoremExperiment />} />
            <Route path="inverse-function" element={<InverseFunctionExperiment />} />
            <Route path="composite-function" element={<CompositeFunctionExperiment />} />
            <Route path="partial-fractions" element={<PartialFractionsExperiment />} />
            <Route path="rational-asymptotes" element={<RationalAsymptotesExperiment />} />
            <Route path="piecewise-function" element={<PiecewiseFunctionExperiment />} />
            <Route path="logarithm-spiral" element={<LogarithmSpiralExperiment />} />
            <Route path="function-transform" element={<FunctionTransformExperiment />} />
            <Route path="euclidean-algorithm" element={<EuclideanAlgorithmExperiment />} />
            <Route path="chinese-remainder" element={<ChineseRemainderExperiment />} />
            <Route path="quadratic-residue" element={<QuadraticResidueExperiment />} />
            <Route path="gaussian-integers" element={<GaussianIntegersExperiment />} />
            <Route path="integer-partition" element={<IntegerPartitionExperiment />} />
            <Route path="pell-equation" element={<PellEquationExperiment />} />
            <Route path="prime-counting" element={<PrimeCountingExperiment />} />
            <Route path="digital-root" element={<DigitalRootExperiment />} />
            <Route path="epsilon-delta" element={<EpsilonDeltaExperiment />} />
            <Route path="mean-value-theorem" element={<MeanValueTheoremExperiment />} />
            <Route path="riemann-sum" element={<RiemannSumExperiment />} />
            <Route path="solid-of-revolution" element={<SolidOfRevolutionExperiment />} />
            <Route path="arc-length-curvature" element={<ArcLengthCurvatureExperiment />} />
            <Route path="series-convergence" element={<SeriesConvergenceExperiment />} />
            <Route path="improper-integral" element={<ImproperIntegralExperiment />} />
            <Route path="determinant-geometry" element={<DeterminantGeometryExperiment />} />
            <Route path="kernel-image" element={<KernelImageExperiment />} />
            <Route path="orthogonal-projection" element={<OrthogonalProjectionExperiment />} />
            <Route path="least-squares" element={<LeastSquaresExperiment />} />
            <Route path="quadratic-form" element={<QuadraticFormExperiment />} />
            <Route path="spectral-theorem" element={<SpectralTheoremExperiment />} />
            <Route path="law-large-numbers" element={<LawLargeNumbersExperiment />} />
            <Route path="poisson-process" element={<PoissonProcessExperiment />} />
            <Route path="brownian-motion" element={<BrownianMotionExperiment />} />
            <Route path="monty-hall" element={<MontyHallExperiment />} />
            <Route path="birthday-paradox" element={<BirthdayParadoxExperiment />} />
            <Route path="hypothesis-testing" element={<HypothesisTestingExperiment />} />
            <Route path="confidence-interval" element={<ConfidenceIntervalExperiment />} />
            <Route path="max-likelihood" element={<MaxLikelihoodExperiment />} />
            <Route path="gaussian-mixture" element={<GaussianMixtureExperiment />} />
            <Route path="hidden-markov" element={<HiddenMarkovExperiment />} />
            <Route path="multiple-integral" element={<MultipleIntegralExperiment />} />
            <Route path="line-integral" element={<LineIntegralExperiment />} />
            <Route path="divergence-curl" element={<DivergenceCurlExperiment />} />
            <Route path="stokes-theorem" element={<StokesTheoremExperiment />} />
            <Route path="partial-derivative" element={<PartialDerivativeExperiment />} />
            <Route path="directional-derivative" element={<DirectionalDerivativeExperiment />} />
            <Route path="jacobian" element={<JacobianExperiment />} />
            <Route path="vector-calculus-field" element={<VectorCalculusFieldExperiment />} />
            <Route path="laplacian" element={<LaplacianExperiment />} />
            <Route path="dijkstra" element={<DijkstraExperiment />} />
            <Route path="network-flow" element={<NetworkFlowExperiment />} />
            <Route path="graph-coloring" element={<GraphColoringExperiment />} />
            <Route path="euler-hamilton-path" element={<EulerHamiltonPathExperiment />} />
            <Route path="sorting-algorithms" element={<SortingAlgorithmsExperiment />} />
            <Route path="bfs-dfs" element={<BfsDfsExperiment />} />
            <Route path="dynamic-programming" element={<DynamicProgrammingExperiment />} />
            <Route path="divide-conquer" element={<DivideConquerExperiment />} />
            <Route path="huffman-coding" element={<HuffmanCodingExperiment />} />
            <Route path="catalan-numbers" element={<CatalanNumbersExperiment />} />
            <Route path="generating-functions" element={<GeneratingFunctionsExperiment />} />
            <Route path="minimum-spanning-tree" element={<MinimumSpanningTreeExperiment />} />
            <Route path="logistic-bifurcation" element={<LogisticBifurcationExperiment />} />
            <Route path="phase-portrait" element={<PhasePortraitExperiment />} />
            <Route path="limit-cycle" element={<LimitCycleExperiment />} />
            <Route path="lotka-volterra" element={<LotkaVolterraExperiment />} />
            <Route path="pendulum-phase" element={<PendulumPhaseExperiment />} />
            <Route path="kepler-orbit" element={<KeplerOrbitExperiment />} />
            <Route path="vibrating-string" element={<VibratingStringExperiment />} />
            <Route path="poincare-section" element={<PoincareSectionExperiment />} />
            <Route path="euler-characteristic" element={<EulerCharacteristicExperiment />} />
            <Route path="torus-klein" element={<TorusKleinExperiment />} />
            <Route path="perceptron" element={<PerceptronExperiment />} />
            <Route path="kmeans" element={<KmeansExperiment />} />
            <Route path="neural-network-forward" element={<NeuralNetworkForwardExperiment />} />
          </Route>
          <Route path="/admin" element={<BugAdminPage />} />
          <Route path="/valentine" element={<Suspense fallback={<div className="fixed inset-0 bg-[#0a050f]" />}><ValentineMobile /></Suspense>} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
