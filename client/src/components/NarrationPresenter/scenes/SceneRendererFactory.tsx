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
const SieveEratosthenesSceneRenderer = lazy(() => import('./SieveEratosthenes/SieveEratosthenesSceneRenderer'))
const MagicSquareSceneRenderer = lazy(() => import('./MagicSquare/MagicSquareSceneRenderer'))
const TowerOfHanoiSceneRenderer = lazy(() => import('./TowerOfHanoi/TowerOfHanoiSceneRenderer'))
const PigeonholeSceneRenderer = lazy(() => import('./Pigeonhole/PigeonholeSceneRenderer'))
const TriangleCentersSceneRenderer = lazy(() => import('./TriangleCenters/TriangleCentersSceneRenderer'))
const NumberBasesSceneRenderer = lazy(() => import('./NumberBases/NumberBasesSceneRenderer'))
const PythagorasTreeSceneRenderer = lazy(() => import('./PythagorasTree/PythagorasTreeSceneRenderer'))
const TessellationSceneRenderer = lazy(() => import('./Tessellation/TessellationSceneRenderer'))
const PerfectNumbersSceneRenderer = lazy(() => import('./PerfectNumbers/PerfectNumbersSceneRenderer'))
const CollatzSceneRenderer = lazy(() => import('./Collatz/CollatzSceneRenderer'))
const PrimeFactorizationSceneRenderer = lazy(() => import('./PrimeFactorization/PrimeFactorizationSceneRenderer'))
const FibonacciNatureSceneRenderer = lazy(() => import('./FibonacciNature/FibonacciNatureSceneRenderer'))
const DiceProbabilitySceneRenderer = lazy(() => import('./DiceProbability/DiceProbabilitySceneRenderer'))
const NinePointCircleSceneRenderer = lazy(() => import('./NinePointCircle/NinePointCircleSceneRenderer'))
const EulerLineSceneRenderer = lazy(() => import('./EulerLine/EulerLineSceneRenderer'))
const InversiveGeometrySceneRenderer = lazy(() => import('./InversiveGeometry/InversiveGeometrySceneRenderer'))
const PoincareDiskSceneRenderer = lazy(() => import('./PoincareDisk/PoincareDiskSceneRenderer'))
const SphericalGeometrySceneRenderer = lazy(() => import('./SphericalGeometry/SphericalGeometrySceneRenderer'))
const ConvexHullSceneRenderer = lazy(() => import('./ConvexHull/ConvexHullSceneRenderer'))
const DelaunayTriangulationSceneRenderer = lazy(() => import('./DelaunayTriangulation/DelaunayTriangulationSceneRenderer'))
const ApollonianGasketSceneRenderer = lazy(() => import('./ApollonianGasket/ApollonianGasketSceneRenderer'))
const PickTheoremSceneRenderer = lazy(() => import('./PickTheorem/PickTheoremSceneRenderer'))
const ReuleauxSceneRenderer = lazy(() => import('./Reuleaux/ReuleauxSceneRenderer'))
const CirclePackingSceneRenderer = lazy(() => import('./CirclePacking/CirclePackingSceneRenderer'))
const SteinerChainSceneRenderer = lazy(() => import('./SteinerChain/SteinerChainSceneRenderer'))
const PolynomialRootsSceneRenderer = lazy(() => import('./PolynomialRoots/PolynomialRootsSceneRenderer'))
const VietaFormulasSceneRenderer = lazy(() => import('./VietaFormulas/VietaFormulasSceneRenderer'))
const BinomialTheoremSceneRenderer = lazy(() => import('./BinomialTheorem/BinomialTheoremSceneRenderer'))
const InverseFunctionSceneRenderer = lazy(() => import('./InverseFunction/InverseFunctionSceneRenderer'))
const CompositeFunctionSceneRenderer = lazy(() => import('./CompositeFunction/CompositeFunctionSceneRenderer'))
const PartialFractionsSceneRenderer = lazy(() => import('./PartialFractions/PartialFractionsSceneRenderer'))
const RationalAsymptotesSceneRenderer = lazy(() => import('./RationalAsymptotes/RationalAsymptotesSceneRenderer'))
const PiecewiseFunctionSceneRenderer = lazy(() => import('./PiecewiseFunction/PiecewiseFunctionSceneRenderer'))
const LogarithmSpiralSceneRenderer = lazy(() => import('./LogarithmSpiral/LogarithmSpiralSceneRenderer'))
const FunctionTransformSceneRenderer = lazy(() => import('./FunctionTransform/FunctionTransformSceneRenderer'))
const EuclideanAlgorithmSceneRenderer = lazy(() => import('./EuclideanAlgorithm/EuclideanAlgorithmSceneRenderer'))
const ChineseRemainderSceneRenderer = lazy(() => import('./ChineseRemainder/ChineseRemainderSceneRenderer'))
const QuadraticResidueSceneRenderer = lazy(() => import('./QuadraticResidue/QuadraticResidueSceneRenderer'))
const GaussianIntegersSceneRenderer = lazy(() => import('./GaussianIntegers/GaussianIntegersSceneRenderer'))
const IntegerPartitionSceneRenderer = lazy(() => import('./IntegerPartition/IntegerPartitionSceneRenderer'))
const PellEquationSceneRenderer = lazy(() => import('./PellEquation/PellEquationSceneRenderer'))
const PrimeCountingSceneRenderer = lazy(() => import('./PrimeCounting/PrimeCountingSceneRenderer'))
const DigitalRootSceneRenderer = lazy(() => import('./DigitalRoot/DigitalRootSceneRenderer'))
const EpsilonDeltaSceneRenderer = lazy(() => import('./EpsilonDelta/EpsilonDeltaSceneRenderer'))
const MeanValueTheoremSceneRenderer = lazy(() => import('./MeanValueTheorem/MeanValueTheoremSceneRenderer'))
const RiemannSumSceneRenderer = lazy(() => import('./RiemannSum/RiemannSumSceneRenderer'))
const SolidOfRevolutionSceneRenderer = lazy(() => import('./SolidOfRevolution/SolidOfRevolutionSceneRenderer'))
const ArcLengthCurvatureSceneRenderer = lazy(() => import('./ArcLengthCurvature/ArcLengthCurvatureSceneRenderer'))
const SeriesConvergenceSceneRenderer = lazy(() => import('./SeriesConvergence/SeriesConvergenceSceneRenderer'))
const ImproperIntegralSceneRenderer = lazy(() => import('./ImproperIntegral/ImproperIntegralSceneRenderer'))
const DeterminantGeometrySceneRenderer = lazy(() => import('./DeterminantGeometry/DeterminantGeometrySceneRenderer'))
const KernelImageSceneRenderer = lazy(() => import('./KernelImage/KernelImageSceneRenderer'))
const OrthogonalProjectionSceneRenderer = lazy(() => import('./OrthogonalProjection/OrthogonalProjectionSceneRenderer'))
const LeastSquaresSceneRenderer = lazy(() => import('./LeastSquares/LeastSquaresSceneRenderer'))
const QuadraticFormSceneRenderer = lazy(() => import('./QuadraticForm/QuadraticFormSceneRenderer'))
const SpectralTheoremSceneRenderer = lazy(() => import('./SpectralTheorem/SpectralTheoremSceneRenderer'))
const LawLargeNumbersSceneRenderer = lazy(() => import('./LawLargeNumbers/LawLargeNumbersSceneRenderer'))
const PoissonProcessSceneRenderer = lazy(() => import('./PoissonProcess/PoissonProcessSceneRenderer'))
const BrownianMotionSceneRenderer = lazy(() => import('./BrownianMotion/BrownianMotionSceneRenderer'))
const MontyHallSceneRenderer = lazy(() => import('./MontyHall/MontyHallSceneRenderer'))
const BirthdayParadoxSceneRenderer = lazy(() => import('./BirthdayParadox/BirthdayParadoxSceneRenderer'))
const HypothesisTestingSceneRenderer = lazy(() => import('./HypothesisTesting/HypothesisTestingSceneRenderer'))
const ConfidenceIntervalSceneRenderer = lazy(() => import('./ConfidenceInterval/ConfidenceIntervalSceneRenderer'))
const MaxLikelihoodSceneRenderer = lazy(() => import('./MaxLikelihood/MaxLikelihoodSceneRenderer'))
const GaussianMixtureSceneRenderer = lazy(() => import('./GaussianMixture/GaussianMixtureSceneRenderer'))
const HiddenMarkovSceneRenderer = lazy(() => import('./HiddenMarkov/HiddenMarkovSceneRenderer'))
const MultipleIntegralSceneRenderer = lazy(() => import('./MultipleIntegral/MultipleIntegralSceneRenderer'))
const LineIntegralSceneRenderer = lazy(() => import('./LineIntegral/LineIntegralSceneRenderer'))
const DivergenceCurlSceneRenderer = lazy(() => import('./DivergenceCurl/DivergenceCurlSceneRenderer'))
const StokesTheoremSceneRenderer = lazy(() => import('./StokesTheorem/StokesTheoremSceneRenderer'))
const PartialDerivativeSceneRenderer = lazy(() => import('./PartialDerivative/PartialDerivativeSceneRenderer'))
const DirectionalDerivativeSceneRenderer = lazy(() => import('./DirectionalDerivative/DirectionalDerivativeSceneRenderer'))
const JacobianSceneRenderer = lazy(() => import('./Jacobian/JacobianSceneRenderer'))
const VectorCalculusFieldSceneRenderer = lazy(() => import('./VectorCalculusField/VectorCalculusFieldSceneRenderer'))
const LaplacianSceneRenderer = lazy(() => import('./Laplacian/LaplacianSceneRenderer'))
const DijkstraSceneRenderer = lazy(() => import('./Dijkstra/DijkstraSceneRenderer'))
const NetworkFlowSceneRenderer = lazy(() => import('./NetworkFlow/NetworkFlowSceneRenderer'))
const GraphColoringSceneRenderer = lazy(() => import('./GraphColoring/GraphColoringSceneRenderer'))
const EulerHamiltonPathSceneRenderer = lazy(() => import('./EulerHamiltonPath/EulerHamiltonPathSceneRenderer'))
const SortingAlgorithmsSceneRenderer = lazy(() => import('./SortingAlgorithms/SortingAlgorithmsSceneRenderer'))
const BfsDfsSceneRenderer = lazy(() => import('./BfsDfs/BfsDfsSceneRenderer'))
const DynamicProgrammingSceneRenderer = lazy(() => import('./DynamicProgramming/DynamicProgrammingSceneRenderer'))
const DivideConquerSceneRenderer = lazy(() => import('./DivideConquer/DivideConquerSceneRenderer'))
const HuffmanCodingSceneRenderer = lazy(() => import('./HuffmanCoding/HuffmanCodingSceneRenderer'))
const CatalanNumbersSceneRenderer = lazy(() => import('./CatalanNumbers/CatalanNumbersSceneRenderer'))
const GeneratingFunctionsSceneRenderer = lazy(() => import('./GeneratingFunctions/GeneratingFunctionsSceneRenderer'))
const MinimumSpanningTreeSceneRenderer = lazy(() => import('./MinimumSpanningTree/MinimumSpanningTreeSceneRenderer'))
const LogisticBifurcationSceneRenderer = lazy(() => import('./LogisticBifurcation/LogisticBifurcationSceneRenderer'))
const PhasePortraitSceneRenderer = lazy(() => import('./PhasePortrait/PhasePortraitSceneRenderer'))
const LimitCycleSceneRenderer = lazy(() => import('./LimitCycle/LimitCycleSceneRenderer'))
const LotkaVolterraSceneRenderer = lazy(() => import('./LotkaVolterra/LotkaVolterraSceneRenderer'))
const PendulumPhaseSceneRenderer = lazy(() => import('./PendulumPhase/PendulumPhaseSceneRenderer'))
const KeplerOrbitSceneRenderer = lazy(() => import('./KeplerOrbit/KeplerOrbitSceneRenderer'))
const VibratingStringSceneRenderer = lazy(() => import('./VibratingString/VibratingStringSceneRenderer'))
const PoincareSectionSceneRenderer = lazy(() => import('./PoincareSection/PoincareSectionSceneRenderer'))
const EulerCharacteristicSceneRenderer = lazy(() => import('./EulerCharacteristic/EulerCharacteristicSceneRenderer'))
const TorusKleinSceneRenderer = lazy(() => import('./TorusKlein/TorusKleinSceneRenderer'))
const PerceptronSceneRenderer = lazy(() => import('./Perceptron/PerceptronSceneRenderer'))
const KmeansSceneRenderer = lazy(() => import('./Kmeans/KmeansSceneRenderer'))
const NeuralNetworkForwardSceneRenderer = lazy(() => import('./NeuralNetworkForward/NeuralNetworkForwardSceneRenderer'))
const KochSnowflakeSceneRenderer = lazy(() => import('./KochSnowflake/KochSnowflakeSceneRenderer'))
const SierpinskiTriangleSceneRenderer = lazy(() => import('./SierpinskiTriangle/SierpinskiTriangleSceneRenderer'))
const SierpinskiCarpetSceneRenderer = lazy(() => import('./SierpinskiCarpet/SierpinskiCarpetSceneRenderer'))
const DragonCurveSceneRenderer = lazy(() => import('./DragonCurve/DragonCurveSceneRenderer'))
const BarnsleyFernSceneRenderer = lazy(() => import('./BarnsleyFern/BarnsleyFernSceneRenderer'))
const HilbertCurveSceneRenderer = lazy(() => import('./HilbertCurve/HilbertCurveSceneRenderer'))
const PeanoCurveSceneRenderer = lazy(() => import('./PeanoCurve/PeanoCurveSceneRenderer'))
const GosperCurveSceneRenderer = lazy(() => import('./GosperCurve/GosperCurveSceneRenderer'))
const LevyCCurveSceneRenderer = lazy(() => import('./LevyCCurve/LevyCCurveSceneRenderer'))
const NewtonFractalSceneRenderer = lazy(() => import('./NewtonFractal/NewtonFractalSceneRenderer'))
const BurningShipSceneRenderer = lazy(() => import('./BurningShip/BurningShipSceneRenderer'))
const BoxCountingDimensionSceneRenderer = lazy(() => import('./BoxCountingDimension/BoxCountingDimensionSceneRenderer'))
const CantorSetSceneRenderer = lazy(() => import('./CantorSet/CantorSetSceneRenderer'))
const QuadtreeSceneRenderer = lazy(() => import('./Quadtree/QuadtreeSceneRenderer'))
const KdTreeSceneRenderer = lazy(() => import('./KdTree/KdTreeSceneRenderer'))
const MarchingSquaresSceneRenderer = lazy(() => import('./MarchingSquares/MarchingSquaresSceneRenderer'))
const PointInPolygonSceneRenderer = lazy(() => import('./PointInPolygon/PointInPolygonSceneRenderer'))
const LineClippingSceneRenderer = lazy(() => import('./LineClipping/LineClippingSceneRenderer'))
const RotatingCalipersSceneRenderer = lazy(() => import('./RotatingCalipers/RotatingCalipersSceneRenderer'))
const EarClippingSceneRenderer = lazy(() => import('./EarClipping/EarClippingSceneRenderer'))
const AStarSceneRenderer = lazy(() => import('./AStar/AStarSceneRenderer'))
const StereographicProjectionSceneRenderer = lazy(() => import('./StereographicProjection/StereographicProjectionSceneRenderer'))
const HopfFibrationSceneRenderer = lazy(() => import('./HopfFibration/HopfFibrationSceneRenderer'))
const HyperbolicTilingSceneRenderer = lazy(() => import('./HyperbolicTiling/HyperbolicTilingSceneRenderer'))
const SpirographSceneRenderer = lazy(() => import('./Spirograph/SpirographSceneRenderer'))
const EulerTotientSceneRenderer = lazy(() => import('./EulerTotient/EulerTotientSceneRenderer'))
const MobiusFunctionSceneRenderer = lazy(() => import('./MobiusFunction/MobiusFunctionSceneRenderer'))
const FareySequenceSceneRenderer = lazy(() => import('./FareySequence/FareySequenceSceneRenderer'))
const SternBrocotSceneRenderer = lazy(() => import('./SternBrocot/SternBrocotSceneRenderer'))
const PrimitiveRootSceneRenderer = lazy(() => import('./PrimitiveRoot/PrimitiveRootSceneRenderer'))
const FermatLittleSceneRenderer = lazy(() => import('./FermatLittle/FermatLittleSceneRenderer'))
const WilsonTheoremSceneRenderer = lazy(() => import('./WilsonTheorem/WilsonTheoremSceneRenderer'))
const FastExponentiationSceneRenderer = lazy(() => import('./FastExponentiation/FastExponentiationSceneRenderer'))
const PythagoreanTriplesSceneRenderer = lazy(() => import('./PythagoreanTriples/PythagoreanTriplesSceneRenderer'))
const SumOfSquaresSceneRenderer = lazy(() => import('./SumOfSquares/SumOfSquaresSceneRenderer'))
const HappyNumbersSceneRenderer = lazy(() => import('./HappyNumbers/HappyNumbersSceneRenderer'))
const KaprekarSceneRenderer = lazy(() => import('./Kaprekar/KaprekarSceneRenderer'))
const LucasNumbersSceneRenderer = lazy(() => import('./LucasNumbers/LucasNumbersSceneRenderer'))
const TriangularNumbersSceneRenderer = lazy(() => import('./TriangularNumbers/TriangularNumbersSceneRenderer'))
const FrobeniusCoinSceneRenderer = lazy(() => import('./FrobeniusCoin/FrobeniusCoinSceneRenderer'))
const CaesarCipherSceneRenderer = lazy(() => import('./CaesarCipher/CaesarCipherSceneRenderer'))
const VigenereCipherSceneRenderer = lazy(() => import('./VigenereCipher/VigenereCipherSceneRenderer'))
const RsaCipherSceneRenderer = lazy(() => import('./RsaCipher/RsaCipherSceneRenderer'))
const DiffieHellmanSceneRenderer = lazy(() => import('./DiffieHellman/DiffieHellmanSceneRenderer'))
const OneTimePadSceneRenderer = lazy(() => import('./OneTimePad/OneTimePadSceneRenderer'))
const EllipticCurveSceneRenderer = lazy(() => import('./EllipticCurve/EllipticCurveSceneRenderer'))
const JosephusProblemSceneRenderer = lazy(() => import('./JosephusProblem/JosephusProblemSceneRenderer'))
const GrayCodeSceneRenderer = lazy(() => import('./GrayCode/GrayCodeSceneRenderer'))
const LookAndSaySceneRenderer = lazy(() => import('./LookAndSay/LookAndSaySceneRenderer'))
const HillCipherSceneRenderer = lazy(() => import('./HillCipher/HillCipherSceneRenderer'))
const LuDecompositionSceneRenderer = lazy(() => import('./LuDecomposition/LuDecompositionSceneRenderer'))
const QrDecompositionSceneRenderer = lazy(() => import('./QrDecomposition/QrDecompositionSceneRenderer'))
const CholeskySceneRenderer = lazy(() => import('./Cholesky/CholeskySceneRenderer'))
const PowerIterationSceneRenderer = lazy(() => import('./PowerIteration/PowerIterationSceneRenderer'))
const PagerankSceneRenderer = lazy(() => import('./Pagerank/PagerankSceneRenderer'))
const MarkovStationarySceneRenderer = lazy(() => import('./MarkovStationary/MarkovStationarySceneRenderer'))
const CramersRuleSceneRenderer = lazy(() => import('./CramersRule/CramersRuleSceneRenderer'))
const Rotation3dSceneRenderer = lazy(() => import('./Rotation3d/Rotation3dSceneRenderer'))
const GibbsPhenomenonSceneRenderer = lazy(() => import('./GibbsPhenomenon/GibbsPhenomenonSceneRenderer'))
const ChebyshevPolynomialsSceneRenderer = lazy(() => import('./ChebyshevPolynomials/ChebyshevPolynomialsSceneRenderer'))
const LegendrePolynomialsSceneRenderer = lazy(() => import('./LegendrePolynomials/LegendrePolynomialsSceneRenderer'))
const BesselFunctionsSceneRenderer = lazy(() => import('./BesselFunctions/BesselFunctionsSceneRenderer'))
const GammaFunctionSceneRenderer = lazy(() => import('./GammaFunction/GammaFunctionSceneRenderer'))
const FixedPointIterationSceneRenderer = lazy(() => import('./FixedPointIteration/FixedPointIterationSceneRenderer'))
const SecantMethodSceneRenderer = lazy(() => import('./SecantMethod/SecantMethodSceneRenderer'))
const BisectionMethodSceneRenderer = lazy(() => import('./BisectionMethod/BisectionMethodSceneRenderer'))
const FftSceneRenderer = lazy(() => import('./Fft/FftSceneRenderer'))
const AliasingSceneRenderer = lazy(() => import('./Aliasing/AliasingSceneRenderer'))
const AutocorrelationSceneRenderer = lazy(() => import('./Autocorrelation/AutocorrelationSceneRenderer'))
const ConvolutionSceneRenderer = lazy(() => import('./Convolution/ConvolutionSceneRenderer'))
const NyquistSamplingSceneRenderer = lazy(() => import('./NyquistSampling/NyquistSamplingSceneRenderer'))
const WindowingSceneRenderer = lazy(() => import('./Windowing/WindowingSceneRenderer'))
const BSplineSceneRenderer = lazy(() => import('./BSpline/BSplineSceneRenderer'))
const CatmullRomSceneRenderer = lazy(() => import('./CatmullRom/CatmullRomSceneRenderer'))
const DiscreteCosineTransformSceneRenderer = lazy(() => import('./DiscreteCosineTransform/DiscreteCosineTransformSceneRenderer'))

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
  'sieve-eratosthenes': SieveEratosthenesSceneRenderer,
  'magic-square': MagicSquareSceneRenderer,
  'tower-of-hanoi': TowerOfHanoiSceneRenderer,
  'pigeonhole': PigeonholeSceneRenderer,
  'triangle-centers': TriangleCentersSceneRenderer,
  'number-bases': NumberBasesSceneRenderer,
  'pythagoras-tree': PythagorasTreeSceneRenderer,
  'tessellation': TessellationSceneRenderer,
  'perfect-numbers': PerfectNumbersSceneRenderer,
  'collatz': CollatzSceneRenderer,
  'prime-factorization': PrimeFactorizationSceneRenderer,
  'fibonacci-nature': FibonacciNatureSceneRenderer,
  'dice-probability': DiceProbabilitySceneRenderer,
  'nine-point-circle': NinePointCircleSceneRenderer,
  'euler-line': EulerLineSceneRenderer,
  'inversive-geometry': InversiveGeometrySceneRenderer,
  'poincare-disk': PoincareDiskSceneRenderer,
  'spherical-geometry': SphericalGeometrySceneRenderer,
  'convex-hull': ConvexHullSceneRenderer,
  'delaunay-triangulation': DelaunayTriangulationSceneRenderer,
  'apollonian-gasket': ApollonianGasketSceneRenderer,
  'pick-theorem': PickTheoremSceneRenderer,
  'reuleaux': ReuleauxSceneRenderer,
  'circle-packing': CirclePackingSceneRenderer,
  'steiner-chain': SteinerChainSceneRenderer,
  'polynomial-roots': PolynomialRootsSceneRenderer,
  'vieta-formulas': VietaFormulasSceneRenderer,
  'binomial-theorem': BinomialTheoremSceneRenderer,
  'inverse-function': InverseFunctionSceneRenderer,
  'composite-function': CompositeFunctionSceneRenderer,
  'partial-fractions': PartialFractionsSceneRenderer,
  'rational-asymptotes': RationalAsymptotesSceneRenderer,
  'piecewise-function': PiecewiseFunctionSceneRenderer,
  'logarithm-spiral': LogarithmSpiralSceneRenderer,
  'function-transform': FunctionTransformSceneRenderer,
  'euclidean-algorithm': EuclideanAlgorithmSceneRenderer,
  'chinese-remainder': ChineseRemainderSceneRenderer,
  'quadratic-residue': QuadraticResidueSceneRenderer,
  'gaussian-integers': GaussianIntegersSceneRenderer,
  'integer-partition': IntegerPartitionSceneRenderer,
  'pell-equation': PellEquationSceneRenderer,
  'prime-counting': PrimeCountingSceneRenderer,
  'digital-root': DigitalRootSceneRenderer,
  'epsilon-delta': EpsilonDeltaSceneRenderer,
  'mean-value-theorem': MeanValueTheoremSceneRenderer,
  'riemann-sum': RiemannSumSceneRenderer,
  'solid-of-revolution': SolidOfRevolutionSceneRenderer,
  'arc-length-curvature': ArcLengthCurvatureSceneRenderer,
  'series-convergence': SeriesConvergenceSceneRenderer,
  'improper-integral': ImproperIntegralSceneRenderer,
  'determinant-geometry': DeterminantGeometrySceneRenderer,
  'kernel-image': KernelImageSceneRenderer,
  'orthogonal-projection': OrthogonalProjectionSceneRenderer,
  'least-squares': LeastSquaresSceneRenderer,
  'quadratic-form': QuadraticFormSceneRenderer,
  'spectral-theorem': SpectralTheoremSceneRenderer,
  'law-large-numbers': LawLargeNumbersSceneRenderer,
  'poisson-process': PoissonProcessSceneRenderer,
  'brownian-motion': BrownianMotionSceneRenderer,
  'monty-hall': MontyHallSceneRenderer,
  'birthday-paradox': BirthdayParadoxSceneRenderer,
  'hypothesis-testing': HypothesisTestingSceneRenderer,
  'confidence-interval': ConfidenceIntervalSceneRenderer,
  'max-likelihood': MaxLikelihoodSceneRenderer,
  'gaussian-mixture': GaussianMixtureSceneRenderer,
  'hidden-markov': HiddenMarkovSceneRenderer,
  'multiple-integral': MultipleIntegralSceneRenderer,
  'line-integral': LineIntegralSceneRenderer,
  'divergence-curl': DivergenceCurlSceneRenderer,
  'stokes-theorem': StokesTheoremSceneRenderer,
  'partial-derivative': PartialDerivativeSceneRenderer,
  'directional-derivative': DirectionalDerivativeSceneRenderer,
  'jacobian': JacobianSceneRenderer,
  'vector-calculus-field': VectorCalculusFieldSceneRenderer,
  'laplacian': LaplacianSceneRenderer,
  'dijkstra': DijkstraSceneRenderer,
  'network-flow': NetworkFlowSceneRenderer,
  'graph-coloring': GraphColoringSceneRenderer,
  'euler-hamilton-path': EulerHamiltonPathSceneRenderer,
  'sorting-algorithms': SortingAlgorithmsSceneRenderer,
  'bfs-dfs': BfsDfsSceneRenderer,
  'dynamic-programming': DynamicProgrammingSceneRenderer,
  'divide-conquer': DivideConquerSceneRenderer,
  'huffman-coding': HuffmanCodingSceneRenderer,
  'catalan-numbers': CatalanNumbersSceneRenderer,
  'generating-functions': GeneratingFunctionsSceneRenderer,
  'minimum-spanning-tree': MinimumSpanningTreeSceneRenderer,
  'logistic-bifurcation': LogisticBifurcationSceneRenderer,
  'phase-portrait': PhasePortraitSceneRenderer,
  'limit-cycle': LimitCycleSceneRenderer,
  'lotka-volterra': LotkaVolterraSceneRenderer,
  'pendulum-phase': PendulumPhaseSceneRenderer,
  'kepler-orbit': KeplerOrbitSceneRenderer,
  'vibrating-string': VibratingStringSceneRenderer,
  'poincare-section': PoincareSectionSceneRenderer,
  'euler-characteristic': EulerCharacteristicSceneRenderer,
  'torus-klein': TorusKleinSceneRenderer,
  'perceptron': PerceptronSceneRenderer,
  'kmeans': KmeansSceneRenderer,
  'neural-network-forward': NeuralNetworkForwardSceneRenderer,
  'koch-snowflake': KochSnowflakeSceneRenderer,
  'sierpinski-triangle': SierpinskiTriangleSceneRenderer,
  'sierpinski-carpet': SierpinskiCarpetSceneRenderer,
  'dragon-curve': DragonCurveSceneRenderer,
  'barnsley-fern': BarnsleyFernSceneRenderer,
  'hilbert-curve': HilbertCurveSceneRenderer,
  'peano-curve': PeanoCurveSceneRenderer,
  'gosper-curve': GosperCurveSceneRenderer,
  'levy-c-curve': LevyCCurveSceneRenderer,
  'newton-fractal': NewtonFractalSceneRenderer,
  'burning-ship': BurningShipSceneRenderer,
  'box-counting-dimension': BoxCountingDimensionSceneRenderer,
  'cantor-set': CantorSetSceneRenderer,
  'quadtree': QuadtreeSceneRenderer,
  'kd-tree': KdTreeSceneRenderer,
  'marching-squares': MarchingSquaresSceneRenderer,
  'point-in-polygon': PointInPolygonSceneRenderer,
  'line-clipping': LineClippingSceneRenderer,
  'rotating-calipers': RotatingCalipersSceneRenderer,
  'ear-clipping': EarClippingSceneRenderer,
  'a-star': AStarSceneRenderer,
  'stereographic-projection': StereographicProjectionSceneRenderer,
  'hopf-fibration': HopfFibrationSceneRenderer,
  'hyperbolic-tiling': HyperbolicTilingSceneRenderer,
  'spirograph': SpirographSceneRenderer,
  'euler-totient': EulerTotientSceneRenderer,
  'mobius-function': MobiusFunctionSceneRenderer,
  'farey-sequence': FareySequenceSceneRenderer,
  'stern-brocot': SternBrocotSceneRenderer,
  'primitive-root': PrimitiveRootSceneRenderer,
  'fermat-little': FermatLittleSceneRenderer,
  'wilson-theorem': WilsonTheoremSceneRenderer,
  'fast-exponentiation': FastExponentiationSceneRenderer,
  'pythagorean-triples': PythagoreanTriplesSceneRenderer,
  'sum-of-squares': SumOfSquaresSceneRenderer,
  'happy-numbers': HappyNumbersSceneRenderer,
  'kaprekar': KaprekarSceneRenderer,
  'lucas-numbers': LucasNumbersSceneRenderer,
  'triangular-numbers': TriangularNumbersSceneRenderer,
  'frobenius-coin': FrobeniusCoinSceneRenderer,
  'caesar-cipher': CaesarCipherSceneRenderer,
  'vigenere-cipher': VigenereCipherSceneRenderer,
  'rsa-cipher': RsaCipherSceneRenderer,
  'diffie-hellman': DiffieHellmanSceneRenderer,
  'one-time-pad': OneTimePadSceneRenderer,
  'elliptic-curve': EllipticCurveSceneRenderer,
  'josephus-problem': JosephusProblemSceneRenderer,
  'gray-code': GrayCodeSceneRenderer,
  'look-and-say': LookAndSaySceneRenderer,
  'hill-cipher': HillCipherSceneRenderer,
  'lu-decomposition': LuDecompositionSceneRenderer,
  'qr-decomposition': QrDecompositionSceneRenderer,
  'cholesky': CholeskySceneRenderer,
  'power-iteration': PowerIterationSceneRenderer,
  'pagerank': PagerankSceneRenderer,
  'markov-stationary': MarkovStationarySceneRenderer,
  'cramers-rule': CramersRuleSceneRenderer,
  'rotation3d': Rotation3dSceneRenderer,
  'gibbs-phenomenon': GibbsPhenomenonSceneRenderer,
  'chebyshev-polynomials': ChebyshevPolynomialsSceneRenderer,
  'legendre-polynomials': LegendrePolynomialsSceneRenderer,
  'bessel-functions': BesselFunctionsSceneRenderer,
  'gamma-function': GammaFunctionSceneRenderer,
  'fixed-point-iteration': FixedPointIterationSceneRenderer,
  'secant-method': SecantMethodSceneRenderer,
  'bisection-method': BisectionMethodSceneRenderer,
  'fft': FftSceneRenderer,
  'aliasing': AliasingSceneRenderer,
  'autocorrelation': AutocorrelationSceneRenderer,
  'convolution': ConvolutionSceneRenderer,
  'nyquist-sampling': NyquistSamplingSceneRenderer,
  'windowing': WindowingSceneRenderer,
  'b-spline': BSplineSceneRenderer,
  'catmull-rom': CatmullRomSceneRenderer,
  'discrete-cosine-transform': DiscreteCosineTransformSceneRenderer,
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
