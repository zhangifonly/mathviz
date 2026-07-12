/**
 * 场景渲染器工厂
 * 根据实验 ID 返回对应的场景渲染组件
 */

import { lazy, Suspense, useMemo } from 'react'
import type { NarrationLineScene } from '../types'

// 场景渲染器通用 Props
export interface SceneRendererProps {
  scene: NarrationLineScene | null
  isInteractive: boolean
}

// 加载中占位组件
function LoadingScene() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-white/50 text-lg">加载场景中...</div>
    </div>
  )
}

// 混沌理论场景渲染器
const ChaosSceneRenderer = lazy(() => import('./Chaos/ChaosSceneRenderer'))
// 分形场景渲染器
const FractalSceneRenderer = lazy(() => import('./Fractal/FractalSceneRenderer'))
// 博弈论场景渲染器
const GameTheorySceneRenderer = lazy(() => import('./GameTheory/GameTheorySceneRenderer'))
// 泰勒级数场景渲染器
const TaylorSceneRenderer = lazy(() => import('./Taylor/TaylorSceneRenderer'))
// 微积分场景渲染器
const CalculusSceneRenderer = lazy(() => import('./Calculus/CalculusSceneRenderer'))
// 贝叶斯场景渲染器
const BayesSceneRenderer = lazy(() => import('./Bayes/BayesSceneRenderer'))
// 中心极限定理场景渲染器
const CltSceneRenderer = lazy(() => import('./Clt/CltSceneRenderer'))
// 复数场景渲染器
const ComplexSceneRenderer = lazy(() => import('./Complex/ComplexSceneRenderer'))
// 圆锥曲线场景渲染器
const ConicSceneRenderer = lazy(() => import('./Conic/ConicSceneRenderer'))
// 参数方程场景渲染器
const ParametricSceneRenderer = lazy(() => import('./Parametric/ParametricSceneRenderer'))
// 回归分析场景渲染器
const RegressionSceneRenderer = lazy(() => import('./Regression/RegressionSceneRenderer'))
// 傅里叶绘图场景渲染器
const FourierDrawingSceneRenderer = lazy(() => import('./FourierDrawing/FourierDrawingSceneRenderer'))
// 傅里叶级数场景渲染器
const FourierSeriesSceneRenderer = lazy(() => import('./FourierSeries/FourierSeriesSceneRenderer'))
// 梯度下降场景渲染器
const GradientDescentSceneRenderer = lazy(() => import('./GradientDescent/GradientDescentSceneRenderer'))
// 图论场景渲染器
const GraphTheorySceneRenderer = lazy(() => import('./GraphTheory/GraphTheorySceneRenderer'))
// 热方程场景渲染器
const HeatEquationSceneRenderer = lazy(() => import('./HeatEquation/HeatEquationSceneRenderer'))
// 插值场景渲染器
const InterpolationSceneRenderer = lazy(() => import('./Interpolation/InterpolationSceneRenderer'))
// 线性代数场景渲染器
const LinearAlgebraSceneRenderer = lazy(() => import('./LinearAlgebra/LinearAlgebraSceneRenderer'))
// 马尔可夫链场景渲染器
const MarkovChainSceneRenderer = lazy(() => import('./MarkovChain/MarkovChainSceneRenderer'))
// 矩阵分解场景渲染器
const MatrixDecompositionSceneRenderer = lazy(() => import('./MatrixDecomposition/MatrixDecompositionSceneRenderer'))
// 牛顿法场景渲染器
const NewtonMethodSceneRenderer = lazy(() => import('./NewtonMethod/NewtonMethodSceneRenderer'))
// 数值积分场景渲染器
const NumericalIntegrationSceneRenderer = lazy(() => import('./NumericalIntegration/NumericalIntegrationSceneRenderer'))
// 常微分方程场景渲染器
const OdeSceneRenderer = lazy(() => import('./Ode/OdeSceneRenderer'))
// 优化场景渲染器
const OptimizationSceneRenderer = lazy(() => import('./Optimization/OptimizationSceneRenderer'))
// PCA 场景渲染器
const PcaSceneRenderer = lazy(() => import('./Pca/PcaSceneRenderer'))
// 随机游走场景渲染器
const RandomWalkSceneRenderer = lazy(() => import('./RandomWalk/RandomWalkSceneRenderer'))
// 信号处理场景渲染器
const SignalProcessingSceneRenderer = lazy(() => import('./SignalProcessing/SignalProcessingSceneRenderer'))
// 向量场场景渲染器
const VectorFieldSceneRenderer = lazy(() => import('./VectorField/VectorFieldSceneRenderer'))
// 波动方程场景渲染器
const WaveEquationSceneRenderer = lazy(() => import('./WaveEquation/WaveEquationSceneRenderer'))
// 分数场景渲染器
const FractionsSceneRenderer = lazy(() => import('./Fractions/FractionsSceneRenderer'))
// 几何图形场景渲染器
const GeometryShapesSceneRenderer = lazy(() => import('./GeometryShapes/GeometryShapesSceneRenderer'))
// 数论场景渲染器
const NumberTheorySceneRenderer = lazy(() => import('./NumberTheory/NumberTheorySceneRenderer'))
// 黄金比例场景渲染器
const GoldenRatioSceneRenderer = lazy(() => import('./GoldenRatio/GoldenRatioSceneRenderer'))
// 集合论场景渲染器
const SetTheorySceneRenderer = lazy(() => import('./SetTheory/SetTheorySceneRenderer'))
// 概率场景渲染器
const ProbabilitySceneRenderer = lazy(() => import('./Probability/ProbabilitySceneRenderer'))
// 三角函数场景渲染器
const TrigonometrySceneRenderer = lazy(() => import('./Trigonometry/TrigonometrySceneRenderer'))
// 勾股定理场景渲染器
const PythagoreanSceneRenderer = lazy(() => import('./Pythagorean/PythagoreanSceneRenderer'))
// 二次函数场景渲染器
const QuadraticSceneRenderer = lazy(() => import('./Quadratic/QuadraticSceneRenderer'))
// 线性函数场景渲染器
const LinearSceneRenderer = lazy(() => import('./Linear/LinearSceneRenderer'))
// 极坐标场景渲染器
const PolarSceneRenderer = lazy(() => import('./Polar/PolarSceneRenderer'))
// 贝塞尔曲线场景渲染器
const BezierSceneRenderer = lazy(() => import('./Bezier/BezierSceneRenderer'))
// 蒙特卡罗场景渲染器
const MonteCarloSceneRenderer = lazy(() => import('./MonteCarlo/MonteCarloSceneRenderer'))
// 排列组合场景渲染器
const PermutationCombinationSceneRenderer = lazy(() => import('./PermutationCombination/PermutationCombinationSceneRenderer'))
// 拉普拉斯变换场景渲染器
const LaplaceSceneRenderer = lazy(() => import('./Laplace/LaplaceSceneRenderer'))
// 偏微分方程场景渲染器
const PDESceneRenderer = lazy(() => import('./PDE/PDESceneRenderer'))
// 微分几何场景渲染器
const DifferentialGeometrySceneRenderer = lazy(() => import('./DifferentialGeometry/DifferentialGeometrySceneRenderer'))
// 数值分析场景渲染器
const NumericalAnalysisSceneRenderer = lazy(() => import('./NumericalAnalysis/NumericalAnalysisSceneRenderer'))
// 密码学场景渲染器
const CryptographySceneRenderer = lazy(() => import('./Cryptography/CryptographySceneRenderer'))
// 傅里叶变换场景渲染器
const FourierSceneRenderer = lazy(() => import('./Fourier/FourierSceneRenderer'))
// 基础算术场景渲染器
const BasicArithmeticSceneRenderer = lazy(() => import('./BasicArithmetic/BasicArithmeticSceneRenderer'))
// 康威生命游戏场景渲染器
const GameOfLifeSceneRenderer = lazy(() => import('./GameOfLife/GameOfLifeSceneRenderer'))
// 欧拉恒等式场景渲染器
const EulerIdentitySceneRenderer = lazy(() => import('./EulerIdentity/EulerIdentitySceneRenderer'))
// 三体引力场景渲染器
const ThreeBodySceneRenderer = lazy(() => import('./ThreeBody/ThreeBodySceneRenderer'))
// 反应扩散场景渲染器
const ReactionDiffusionSceneRenderer = lazy(() => import('./ReactionDiffusion/ReactionDiffusionSceneRenderer'))
// 莫比乌斯环场景渲染器
const MobiusSceneRenderer = lazy(() => import('./Mobius/MobiusSceneRenderer'))
const CycloidSceneRenderer = lazy(() => import('./Cycloid/CycloidSceneRenderer'))
const LissajousSceneRenderer = lazy(() => import('./Lissajous/LissajousSceneRenderer'))
const UlamSpiralSceneRenderer = lazy(() => import('./UlamSpiral/UlamSpiralSceneRenderer'))
const PascalTriangleSceneRenderer = lazy(() => import('./PascalTriangle/PascalTriangleSceneRenderer'))
const VoronoiSceneRenderer = lazy(() => import('./Voronoi/VoronoiSceneRenderer'))
const LSystemSceneRenderer = lazy(() => import('./LSystem/LSystemSceneRenderer'))
const EvenOddSceneRenderer = lazy(() => import('./EvenOdd/EvenOddSceneRenderer'))
const RomanNumeralsSceneRenderer = lazy(() => import('./RomanNumerals/RomanNumeralsSceneRenderer'))
const SymmetrySceneRenderer = lazy(() => import('./Symmetry/SymmetrySceneRenderer'))
const TangramSceneRenderer = lazy(() => import('./Tangram/TangramSceneRenderer'))
const ClockAnglesSceneRenderer = lazy(() => import('./ClockAngles/ClockAnglesSceneRenderer'))
const InequalitiesSceneRenderer = lazy(() => import('./Inequalities/InequalitiesSceneRenderer'))
const LinearSystemSceneRenderer = lazy(() => import('./LinearSystem/LinearSystemSceneRenderer'))
const SimilarTrianglesSceneRenderer = lazy(() => import('./SimilarTriangles/SimilarTrianglesSceneRenderer'))
const CircleGeometrySceneRenderer = lazy(() => import('./CircleGeometry/CircleGeometrySceneRenderer'))
const StatsBasicsSceneRenderer = lazy(() => import('./StatsBasics/StatsBasicsSceneRenderer'))
const AbsoluteValueSceneRenderer = lazy(() => import('./AbsoluteValue/AbsoluteValueSceneRenderer'))
const SequencesSceneRenderer = lazy(() => import('./Sequences/SequencesSceneRenderer'))
const ExponentialLogSceneRenderer = lazy(() => import('./ExponentialLog/ExponentialLogSceneRenderer'))
const MatrixTransformSceneRenderer = lazy(() => import('./MatrixTransform/MatrixTransformSceneRenderer'))
const DotCrossProductSceneRenderer = lazy(() => import('./DotCrossProduct/DotCrossProductSceneRenderer'))
const ParabolaOpticsSceneRenderer = lazy(() => import('./ParabolaOptics/ParabolaOpticsSceneRenderer'))
const SineSuperpositionSceneRenderer = lazy(() => import('./SineSuperposition/SineSuperpositionSceneRenderer'))
const CombinatorialProofSceneRenderer = lazy(() => import('./CombinatorialProof/CombinatorialProofSceneRenderer'))
const ModularArithmeticSceneRenderer = lazy(() => import('./ModularArithmetic/ModularArithmeticSceneRenderer'))
const ContinuedFractionSceneRenderer = lazy(() => import('./ContinuedFraction/ContinuedFractionSceneRenderer'))
const EpidemicSirSceneRenderer = lazy(() => import('./EpidemicSir/EpidemicSirSceneRenderer'))
const EigenVisualizationSceneRenderer = lazy(() => import('./EigenVisualization/EigenVisualizationSceneRenderer'))
const SvdSceneRenderer = lazy(() => import('./Svd/SvdSceneRenderer'))
const GramSchmidtSceneRenderer = lazy(() => import('./GramSchmidt/GramSchmidtSceneRenderer'))
const LagrangeMultiplierSceneRenderer = lazy(() => import('./LagrangeMultiplier/LagrangeMultiplierSceneRenderer'))
const GreenTheoremSceneRenderer = lazy(() => import('./GreenTheorem/GreenTheoremSceneRenderer'))
const ResidueTheoremSceneRenderer = lazy(() => import('./ResidueTheorem/ResidueTheoremSceneRenderer'))
const PowerSeriesSceneRenderer = lazy(() => import('./PowerSeries/PowerSeriesSceneRenderer'))
const GaussianProcessSceneRenderer = lazy(() => import('./GaussianProcess/GaussianProcessSceneRenderer'))
const KalmanFilterSceneRenderer = lazy(() => import('./KalmanFilter/KalmanFilterSceneRenderer'))
const SimulatedAnnealingSceneRenderer = lazy(() => import('./SimulatedAnnealing/SimulatedAnnealingSceneRenderer'))
const MandelbrotJuliaSceneRenderer = lazy(() => import('./MandelbrotJulia/MandelbrotJuliaSceneRenderer'))
const DoublePendulumSceneRenderer = lazy(() => import('./DoublePendulum/DoublePendulumSceneRenderer'))
const LorenzAttractorSceneRenderer = lazy(() => import('./LorenzAttractor/LorenzAttractorSceneRenderer'))
const NbodySimulationSceneRenderer = lazy(() => import('./NbodySimulation/NbodySimulationSceneRenderer'))
const PercolationSceneRenderer = lazy(() => import('./Percolation/PercolationSceneRenderer'))
const CellularAutomataSceneRenderer = lazy(() => import('./CellularAutomata/CellularAutomataSceneRenderer'))
const KnotTheorySceneRenderer = lazy(() => import('./KnotTheory/KnotTheorySceneRenderer'))
const WaveletSceneRenderer = lazy(() => import('./Wavelet/WaveletSceneRenderer'))

// 场景渲染器映射
const rendererMap: Record<string, ReturnType<typeof lazy>> = {
  'chaos': ChaosSceneRenderer,
  'fractal': FractalSceneRenderer,
  'game-theory': GameTheorySceneRenderer,
  'taylor': TaylorSceneRenderer,
  'calculus': CalculusSceneRenderer,
  'bayes': BayesSceneRenderer,
  'clt': CltSceneRenderer,
  'complex': ComplexSceneRenderer,
  'conic-sections': ConicSceneRenderer,
  'parametric': ParametricSceneRenderer,
  'regression': RegressionSceneRenderer,
  'fourier-drawing': FourierDrawingSceneRenderer,
  'fourier-series': FourierSeriesSceneRenderer,
  'gradient-descent': GradientDescentSceneRenderer,
  'graph-theory': GraphTheorySceneRenderer,
  'heat-equation': HeatEquationSceneRenderer,
  'interpolation': InterpolationSceneRenderer,
  'linear-algebra': LinearAlgebraSceneRenderer,
  'markov-chain': MarkovChainSceneRenderer,
  'matrix-decomposition': MatrixDecompositionSceneRenderer,
  'newton-method': NewtonMethodSceneRenderer,
  'numerical-integration': NumericalIntegrationSceneRenderer,
  'ode': OdeSceneRenderer,
  'optimization': OptimizationSceneRenderer,
  'pca': PcaSceneRenderer,
  'random-walk': RandomWalkSceneRenderer,
  'signal-processing': SignalProcessingSceneRenderer,
  'vector-field': VectorFieldSceneRenderer,
  'wave-equation': WaveEquationSceneRenderer,
  'fractions': FractionsSceneRenderer,
  'geometry-shapes': GeometryShapesSceneRenderer,
  'number-theory': NumberTheorySceneRenderer,
  'golden-ratio': GoldenRatioSceneRenderer,
  'set-theory': SetTheorySceneRenderer,
  'probability': ProbabilitySceneRenderer,
  'trigonometry': TrigonometrySceneRenderer,
  'pythagorean': PythagoreanSceneRenderer,
  'quadratic-function': QuadraticSceneRenderer,
  'linear-function': LinearSceneRenderer,
  'polar': PolarSceneRenderer,
  'bezier': BezierSceneRenderer,
  'monte-carlo': MonteCarloSceneRenderer,
  'permutation-combination': PermutationCombinationSceneRenderer,
  'laplace': LaplaceSceneRenderer,
  'pde': PDESceneRenderer,
  'differential-geometry': DifferentialGeometrySceneRenderer,
  'numerical-analysis': NumericalAnalysisSceneRenderer,
  'cryptography': CryptographySceneRenderer,
  'fourier': FourierSceneRenderer,
  'basic-arithmetic': BasicArithmeticSceneRenderer,
  'game-of-life': GameOfLifeSceneRenderer,
  'euler-identity': EulerIdentitySceneRenderer,
  'three-body': ThreeBodySceneRenderer,
  'reaction-diffusion': ReactionDiffusionSceneRenderer,
  'mobius': MobiusSceneRenderer,
  'cycloid': CycloidSceneRenderer,
  'lissajous': LissajousSceneRenderer,
  'ulam-spiral': UlamSpiralSceneRenderer,
  'pascal-triangle': PascalTriangleSceneRenderer,
  'voronoi': VoronoiSceneRenderer,
  'l-system': LSystemSceneRenderer,
  'even-odd': EvenOddSceneRenderer,
  'roman-numerals': RomanNumeralsSceneRenderer,
  'symmetry': SymmetrySceneRenderer,
  'tangram': TangramSceneRenderer,
  'clock-angles': ClockAnglesSceneRenderer,
  'inequalities': InequalitiesSceneRenderer,
  'linear-system': LinearSystemSceneRenderer,
  'similar-triangles': SimilarTrianglesSceneRenderer,
  'circle-geometry': CircleGeometrySceneRenderer,
  'stats-basics': StatsBasicsSceneRenderer,
  'absolute-value': AbsoluteValueSceneRenderer,
  'sequences': SequencesSceneRenderer,
  'exponential-log': ExponentialLogSceneRenderer,
  'matrix-transform': MatrixTransformSceneRenderer,
  'dot-cross-product': DotCrossProductSceneRenderer,
  'parabola-optics': ParabolaOpticsSceneRenderer,
  'sine-superposition': SineSuperpositionSceneRenderer,
  'combinatorial-proof': CombinatorialProofSceneRenderer,
  'modular-arithmetic': ModularArithmeticSceneRenderer,
  'continued-fraction': ContinuedFractionSceneRenderer,
  'epidemic-sir': EpidemicSirSceneRenderer,
  'eigen-visualization': EigenVisualizationSceneRenderer,
  'svd': SvdSceneRenderer,
  'gram-schmidt': GramSchmidtSceneRenderer,
  'lagrange-multiplier': LagrangeMultiplierSceneRenderer,
  'green-theorem': GreenTheoremSceneRenderer,
  'residue-theorem': ResidueTheoremSceneRenderer,
  'power-series': PowerSeriesSceneRenderer,
  'gaussian-process': GaussianProcessSceneRenderer,
  'kalman-filter': KalmanFilterSceneRenderer,
  'simulated-annealing': SimulatedAnnealingSceneRenderer,
  'mandelbrot-julia': MandelbrotJuliaSceneRenderer,
  'double-pendulum': DoublePendulumSceneRenderer,
  'lorenz-attractor': LorenzAttractorSceneRenderer,
  'nbody-simulation': NbodySimulationSceneRenderer,
  'percolation': PercolationSceneRenderer,
  'cellular-automata': CellularAutomataSceneRenderer,
  'knot-theory': KnotTheorySceneRenderer,
  'wavelet': WaveletSceneRenderer,
}

// 获取场景渲染器
// eslint-disable-next-line react-refresh/only-export-components
export function getSceneRenderer(experimentId: string): ReturnType<typeof lazy> | null {
  return rendererMap[experimentId] || null
}

// 场景渲染器包装组件（带 Suspense）
interface SceneRendererWrapperProps extends SceneRendererProps {
  experimentId: string
}

export default function SceneRendererWrapper({
  experimentId,
  scene,
  isInteractive,
}: SceneRendererWrapperProps) {
  const Renderer = useMemo(() => getSceneRenderer(experimentId), [experimentId])

  if (!Renderer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">该实验暂无专属场景</div>
      </div>
    )
  }

  return (
    <Suspense fallback={<LoadingScene />}>
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Renderer scene={scene} isInteractive={isInteractive} />
    </Suspense>
  )
}
