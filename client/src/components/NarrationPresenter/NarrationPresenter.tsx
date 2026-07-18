/**
 * 讲解演示器组件
 *
 * 全屏 PPT 式讲解界面，每句讲解对应一个场景
 * 移动端优化：点击屏幕显示/隐藏控制栏，播放后自动隐藏
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNarration } from '../../contexts/NarrationContext'
import type { SceneState, NarrationLineScene } from './types'
import { fourierScenes, defaultFourierState } from './fourierScenes'
import { basicArithmeticScenes, defaultArithmeticState } from './basicArithmeticScenes'
import { fractionsScenes, defaultFractionsState } from './fractionsScenes'
import { geometryShapesScenes, defaultGeometryState } from './geometryShapesScenes'
import { numberTheoryScenes, defaultNumberTheoryState } from './numberTheoryScenes'
import { goldenRatioScenes, defaultGoldenRatioState } from './goldenRatioScenes'
import { setTheoryScenes, defaultSetTheoryState } from './setTheoryScenes'
import { probabilityScenes, defaultProbabilityState } from './probabilityScenes'
import { trigonometryScenes, defaultTrigonometryState } from './trigonometryScenes'
import { pythagoreanScenes, defaultPythagoreanState } from './pythagoreanScenes'
import { quadraticScenes, defaultQuadraticState } from './quadraticScenes'
import { linearScenes, defaultLinearState } from './linearScenes'
import { polarScenes, defaultPolarState } from './polarScenes'
import { bezierScenes, defaultBezierState } from './bezierScenes'
import { monteCarloScenes, defaultMonteCarloState } from './monteCarloScenes'
import { bayesScenes, defaultBayesState } from './bayesScenes'
import { calculusScenes, defaultCalculusState } from './calculusScenes'
import { cltScenes, defaultCltState } from './cltScenes'
import { complexScenes, defaultComplexState } from './complexScenes'
import { conicScenes, defaultConicState } from './conicScenes'
import { parametricScenes, defaultParametricState } from './parametricScenes'
import { regressionScenes, defaultRegressionState } from './regressionScenes'
import { taylorScenes, defaultTaylorState } from './taylorScenes'
// 新增21个高级实验场景
import { chaosScenes, defaultChaosState } from './chaosScenes'
import { fourierDrawingScenes, defaultFourierDrawingState } from './fourierDrawingScenes'
import { fourierSeriesScenes, defaultFourierSeriesState } from './fourierSeriesScenes'
import { fractalScenes, defaultFractalState } from './fractalScenes'
import { gameTheoryScenes, defaultGameTheoryState } from './gameTheoryScenes'
import { gradientDescentScenes, defaultGradientDescentState } from './gradientDescentScenes'
import { graphTheoryScenes, defaultGraphTheoryState } from './graphTheoryScenes'
import { heatEquationScenes, defaultHeatEquationState } from './heatEquationScenes'
import { interpolationScenes, defaultInterpolationState } from './interpolationScenes'
import { linearAlgebraScenes, defaultLinearAlgebraState } from './linearAlgebraScenes'
import { markovChainScenes, defaultMarkovChainState } from './markovChainScenes'
import { matrixDecompositionScenes, defaultMatrixDecompositionState } from './matrixDecompositionScenes'
import { newtonMethodScenes, defaultNewtonMethodState } from './newtonMethodScenes'
import { numericalIntegrationScenes, defaultNumericalIntegrationState } from './numericalIntegrationScenes'
import { odeScenes, defaultOdeState } from './odeScenes'
import { optimizationScenes, defaultOptimizationState } from './optimizationScenes'
import { pcaScenes, defaultPcaState } from './pcaScenes'
import { randomWalkScenes, defaultRandomWalkState } from './randomWalkScenes'
import { signalProcessingScenes, defaultSignalProcessingState } from './signalProcessingScenes'
import { vectorFieldScenes, defaultVectorFieldState } from './vectorFieldScenes'
import { waveEquationScenes, defaultWaveEquationState } from './waveEquationScenes'
// 新增4个高级实验场景
import { pdeScenes, defaultPdeState } from './pdeScenes'
import { differentialGeometryScenes, defaultDifferentialGeometryState } from './differentialGeometryScenes'
import { numericalAnalysisScenes, defaultNumericalAnalysisState } from './numericalAnalysisScenes'
import { cryptographyScenes, defaultCryptographyState } from './cryptographyScenes'
// 新增2个待完成课程场景
import { laplaceScenes, defaultLaplaceState } from './laplaceScenes'
import { permutationCombinationScenes, defaultPermutationCombinationState } from './permutationCombinationScenes'
import { gameOfLifeScenes, defaultGameOfLifeState } from './gameOfLifeScenes'
import { eulerIdentityScenes, defaultEulerIdentityState } from './eulerIdentityScenes'
import { threeBodyScenes, defaultThreeBodyState } from './threeBodyScenes'
import { reactionDiffusionScenes, defaultReactionDiffusionState } from './reactionDiffusionScenes'
import { mobiusScenes, defaultMobiusState } from './mobiusScenes'
import { cycloidScenes, defaultCycloidState } from './cycloidScenes'
import { lissajousScenes, defaultLissajousState } from './lissajousScenes'
import { ulamSpiralScenes, defaultUlamSpiralState } from './ulamSpiralScenes'
import { pascalTriangleScenes, defaultPascalTriangleState } from './pascalTriangleScenes'
import { voronoiScenes, defaultVoronoiState } from './voronoiScenes'
import { lSystemScenes, defaultLSystemState } from './lSystemScenes'
import { evenOddScenes, defaultEvenOddState } from './evenOddScenes'
import { romanNumeralsScenes, defaultRomanNumeralsState } from './romanNumeralsScenes'
import { symmetryScenes, defaultSymmetryState } from './symmetryScenes'
import { tangramScenes, defaultTangramState } from './tangramScenes'
import { clockAnglesScenes, defaultClockAnglesState } from './clockAnglesScenes'
import { inequalitiesScenes, defaultInequalitiesState } from './inequalitiesScenes'
import { linearSystemScenes, defaultLinearSystemState } from './linearSystemScenes'
import { similarTrianglesScenes, defaultSimilarTrianglesState } from './similarTrianglesScenes'
import { circleGeometryScenes, defaultCircleGeometryState } from './circleGeometryScenes'
import { statsBasicsScenes, defaultStatsBasicsState } from './statsBasicsScenes'
import { absoluteValueScenes, defaultAbsoluteValueState } from './absoluteValueScenes'
import { sequencesScenes, defaultSequencesState } from './sequencesScenes'
import { exponentialLogScenes, defaultExponentialLogState } from './exponentialLogScenes'
import { matrixTransformScenes, defaultMatrixTransformState } from './matrixTransformScenes'
import { dotCrossProductScenes, defaultDotCrossProductState } from './dotCrossProductScenes'
import { parabolaOpticsScenes, defaultParabolaOpticsState } from './parabolaOpticsScenes'
import { sineSuperpositionScenes, defaultSineSuperpositionState } from './sineSuperpositionScenes'
import { combinatorialProofScenes, defaultCombinatorialProofState } from './combinatorialProofScenes'
import { modularArithmeticScenes, defaultModularArithmeticState } from './modularArithmeticScenes'
import { continuedFractionScenes, defaultContinuedFractionState } from './continuedFractionScenes'
import { epidemicSirScenes, defaultEpidemicSirState } from './epidemicSirScenes'
import { eigenVisualizationScenes, defaultEigenVisualizationState } from './eigenVisualizationScenes'
import { svdScenes, defaultSvdState } from './svdScenes'
import { gramSchmidtScenes, defaultGramSchmidtState } from './gramSchmidtScenes'
import { lagrangeMultiplierScenes, defaultLagrangeMultiplierState } from './lagrangeMultiplierScenes'
import { greenTheoremScenes, defaultGreenTheoremState } from './greenTheoremScenes'
import { residueTheoremScenes, defaultResidueTheoremState } from './residueTheoremScenes'
import { powerSeriesScenes, defaultPowerSeriesState } from './powerSeriesScenes'
import { gaussianProcessScenes, defaultGaussianProcessState } from './gaussianProcessScenes'
import { kalmanFilterScenes, defaultKalmanFilterState } from './kalmanFilterScenes'
import { simulatedAnnealingScenes, defaultSimulatedAnnealingState } from './simulatedAnnealingScenes'
import { mandelbrotJuliaScenes, defaultMandelbrotJuliaState } from './mandelbrotJuliaScenes'
import { doublePendulumScenes, defaultDoublePendulumState } from './doublePendulumScenes'
import { lorenzAttractorScenes, defaultLorenzAttractorState } from './lorenzAttractorScenes'
import { nbodySimulationScenes, defaultNbodySimulationState } from './nbodySimulationScenes'
import { percolationScenes, defaultPercolationState } from './percolationScenes'
import { cellularAutomataScenes, defaultCellularAutomataState } from './cellularAutomataScenes'
import { knotTheoryScenes, defaultKnotTheoryState } from './knotTheoryScenes'
import { waveletScenes, defaultWaveletState } from './waveletScenes'
import { sieveEratosthenesScenes, defaultSieveEratosthenesState } from './sieveEratosthenesScenes'
import { magicSquareScenes, defaultMagicSquareState } from './magicSquareScenes'
import { towerOfHanoiScenes, defaultTowerOfHanoiState } from './towerOfHanoiScenes'
import { pigeonholeScenes, defaultPigeonholeState } from './pigeonholeScenes'
import { triangleCentersScenes, defaultTriangleCentersState } from './triangleCentersScenes'
import { numberBasesScenes, defaultNumberBasesState } from './numberBasesScenes'
import { pythagorasTreeScenes, defaultPythagorasTreeState } from './pythagorasTreeScenes'
import { tessellationScenes, defaultTessellationState } from './tessellationScenes'
import { perfectNumbersScenes, defaultPerfectNumbersState } from './perfectNumbersScenes'
import { collatzScenes, defaultCollatzState } from './collatzScenes'
import { primeFactorizationScenes, defaultPrimeFactorizationState } from './primeFactorizationScenes'
import { fibonacciNatureScenes, defaultFibonacciNatureState } from './fibonacciNatureScenes'
import { diceProbabilityScenes, defaultDiceProbabilityState } from './diceProbabilityScenes'
import { ninePointCircleScenes, defaultNinePointCircleState } from './ninePointCircleScenes'
import { eulerLineScenes, defaultEulerLineState } from './eulerLineScenes'
import { inversiveGeometryScenes, defaultInversiveGeometryState } from './inversiveGeometryScenes'
import { poincareDiskScenes, defaultPoincareDiskState } from './poincareDiskScenes'
import { sphericalGeometryScenes, defaultSphericalGeometryState } from './sphericalGeometryScenes'
import { convexHullScenes, defaultConvexHullState } from './convexHullScenes'
import { delaunayTriangulationScenes, defaultDelaunayTriangulationState } from './delaunayTriangulationScenes'
import { apollonianGasketScenes, defaultApollonianGasketState } from './apollonianGasketScenes'
import { pickTheoremScenes, defaultPickTheoremState } from './pickTheoremScenes'
import { reuleauxScenes, defaultReuleauxState } from './reuleauxScenes'
import { circlePackingScenes, defaultCirclePackingState } from './circlePackingScenes'
import { steinerChainScenes, defaultSteinerChainState } from './steinerChainScenes'
import { polynomialRootsScenes, defaultPolynomialRootsState } from './polynomialRootsScenes'
import { vietaFormulasScenes, defaultVietaFormulasState } from './vietaFormulasScenes'
import { binomialTheoremScenes, defaultBinomialTheoremState } from './binomialTheoremScenes'
import { inverseFunctionScenes, defaultInverseFunctionState } from './inverseFunctionScenes'
import { compositeFunctionScenes, defaultCompositeFunctionState } from './compositeFunctionScenes'
import { partialFractionsScenes, defaultPartialFractionsState } from './partialFractionsScenes'
import { rationalAsymptotesScenes, defaultRationalAsymptotesState } from './rationalAsymptotesScenes'
import { piecewiseFunctionScenes, defaultPiecewiseFunctionState } from './piecewiseFunctionScenes'
import { logarithmSpiralScenes, defaultLogarithmSpiralState } from './logarithmSpiralScenes'
import { functionTransformScenes, defaultFunctionTransformState } from './functionTransformScenes'
import { euclideanAlgorithmScenes, defaultEuclideanAlgorithmState } from './euclideanAlgorithmScenes'
import { chineseRemainderScenes, defaultChineseRemainderState } from './chineseRemainderScenes'
import { quadraticResidueScenes, defaultQuadraticResidueState } from './quadraticResidueScenes'
import { gaussianIntegersScenes, defaultGaussianIntegersState } from './gaussianIntegersScenes'
import { integerPartitionScenes, defaultIntegerPartitionState } from './integerPartitionScenes'
import { pellEquationScenes, defaultPellEquationState } from './pellEquationScenes'
import { primeCountingScenes, defaultPrimeCountingState } from './primeCountingScenes'
import { digitalRootScenes, defaultDigitalRootState } from './digitalRootScenes'
import { epsilonDeltaScenes, defaultEpsilonDeltaState } from './epsilonDeltaScenes'
import { meanValueTheoremScenes, defaultMeanValueTheoremState } from './meanValueTheoremScenes'
import { riemannSumScenes, defaultRiemannSumState } from './riemannSumScenes'
import { solidOfRevolutionScenes, defaultSolidOfRevolutionState } from './solidOfRevolutionScenes'
import { arcLengthCurvatureScenes, defaultArcLengthCurvatureState } from './arcLengthCurvatureScenes'
import { seriesConvergenceScenes, defaultSeriesConvergenceState } from './seriesConvergenceScenes'
import { improperIntegralScenes, defaultImproperIntegralState } from './improperIntegralScenes'
import { determinantGeometryScenes, defaultDeterminantGeometryState } from './determinantGeometryScenes'
import { kernelImageScenes, defaultKernelImageState } from './kernelImageScenes'
import { orthogonalProjectionScenes, defaultOrthogonalProjectionState } from './orthogonalProjectionScenes'
import { leastSquaresScenes, defaultLeastSquaresState } from './leastSquaresScenes'
import { quadraticFormScenes, defaultQuadraticFormState } from './quadraticFormScenes'
import { spectralTheoremScenes, defaultSpectralTheoremState } from './spectralTheoremScenes'
import { lawLargeNumbersScenes, defaultLawLargeNumbersState } from './lawLargeNumbersScenes'
import { poissonProcessScenes, defaultPoissonProcessState } from './poissonProcessScenes'
import { brownianMotionScenes, defaultBrownianMotionState } from './brownianMotionScenes'
import { montyHallScenes, defaultMontyHallState } from './montyHallScenes'
import { birthdayParadoxScenes, defaultBirthdayParadoxState } from './birthdayParadoxScenes'
import { hypothesisTestingScenes, defaultHypothesisTestingState } from './hypothesisTestingScenes'
import { confidenceIntervalScenes, defaultConfidenceIntervalState } from './confidenceIntervalScenes'
import { maxLikelihoodScenes, defaultMaxLikelihoodState } from './maxLikelihoodScenes'
import { gaussianMixtureScenes, defaultGaussianMixtureState } from './gaussianMixtureScenes'
import { hiddenMarkovScenes, defaultHiddenMarkovState } from './hiddenMarkovScenes'
import { multipleIntegralScenes, defaultMultipleIntegralState } from './multipleIntegralScenes'
import { lineIntegralScenes, defaultLineIntegralState } from './lineIntegralScenes'
import { divergenceCurlScenes, defaultDivergenceCurlState } from './divergenceCurlScenes'
import { stokesTheoremScenes, defaultStokesTheoremState } from './stokesTheoremScenes'
import { partialDerivativeScenes, defaultPartialDerivativeState } from './partialDerivativeScenes'
import { directionalDerivativeScenes, defaultDirectionalDerivativeState } from './directionalDerivativeScenes'
import { jacobianScenes, defaultJacobianState } from './jacobianScenes'
import { vectorCalculusFieldScenes, defaultVectorCalculusFieldState } from './vectorCalculusFieldScenes'
import { laplacianScenes, defaultLaplacianState } from './laplacianScenes'
import { dijkstraScenes, defaultDijkstraState } from './dijkstraScenes'
import { networkFlowScenes, defaultNetworkFlowState } from './networkFlowScenes'
import { graphColoringScenes, defaultGraphColoringState } from './graphColoringScenes'
import { eulerHamiltonPathScenes, defaultEulerHamiltonPathState } from './eulerHamiltonPathScenes'
import { sortingAlgorithmsScenes, defaultSortingAlgorithmsState } from './sortingAlgorithmsScenes'
import { bfsDfsScenes, defaultBfsDfsState } from './bfsDfsScenes'
import { dynamicProgrammingScenes, defaultDynamicProgrammingState } from './dynamicProgrammingScenes'
import { divideConquerScenes, defaultDivideConquerState } from './divideConquerScenes'
import { huffmanCodingScenes, defaultHuffmanCodingState } from './huffmanCodingScenes'
import { catalanNumbersScenes, defaultCatalanNumbersState } from './catalanNumbersScenes'
import { generatingFunctionsScenes, defaultGeneratingFunctionsState } from './generatingFunctionsScenes'
import { minimumSpanningTreeScenes, defaultMinimumSpanningTreeState } from './minimumSpanningTreeScenes'
import { logisticBifurcationScenes, defaultLogisticBifurcationState } from './logisticBifurcationScenes'
import { phasePortraitScenes, defaultPhasePortraitState } from './phasePortraitScenes'
import { limitCycleScenes, defaultLimitCycleState } from './limitCycleScenes'
import { lotkaVolterraScenes, defaultLotkaVolterraState } from './lotkaVolterraScenes'
import { pendulumPhaseScenes, defaultPendulumPhaseState } from './pendulumPhaseScenes'
import { keplerOrbitScenes, defaultKeplerOrbitState } from './keplerOrbitScenes'
import { vibratingStringScenes, defaultVibratingStringState } from './vibratingStringScenes'
import { poincareSectionScenes, defaultPoincareSectionState } from './poincareSectionScenes'
import { eulerCharacteristicScenes, defaultEulerCharacteristicState } from './eulerCharacteristicScenes'
import { torusKleinScenes, defaultTorusKleinState } from './torusKleinScenes'
import { perceptronScenes, defaultPerceptronState } from './perceptronScenes'
import { kmeansScenes, defaultKmeansState } from './kmeansScenes'
import { neuralNetworkForwardScenes, defaultNeuralNetworkForwardState } from './neuralNetworkForwardScenes'
import { kochSnowflakeScenes, defaultKochSnowflakeState } from './kochSnowflakeScenes'
import { sierpinskiTriangleScenes, defaultSierpinskiTriangleState } from './sierpinskiTriangleScenes'
import { sierpinskiCarpetScenes, defaultSierpinskiCarpetState } from './sierpinskiCarpetScenes'
import { dragonCurveScenes, defaultDragonCurveState } from './dragonCurveScenes'
import { barnsleyFernScenes, defaultBarnsleyFernState } from './barnsleyFernScenes'
import { hilbertCurveScenes, defaultHilbertCurveState } from './hilbertCurveScenes'
import { peanoCurveScenes, defaultPeanoCurveState } from './peanoCurveScenes'
import { gosperCurveScenes, defaultGosperCurveState } from './gosperCurveScenes'
import { levyCCurveScenes, defaultLevyCCurveState } from './levyCCurveScenes'
import { newtonFractalScenes, defaultNewtonFractalState } from './newtonFractalScenes'
import { burningShipScenes, defaultBurningShipState } from './burningShipScenes'
import { boxCountingDimensionScenes, defaultBoxCountingDimensionState } from './boxCountingDimensionScenes'
import { cantorSetScenes, defaultCantorSetState } from './cantorSetScenes'
import { quadtreeScenes, defaultQuadtreeState } from './quadtreeScenes'
import { kdTreeScenes, defaultKdTreeState } from './kdTreeScenes'
import { marchingSquaresScenes, defaultMarchingSquaresState } from './marchingSquaresScenes'
import { pointInPolygonScenes, defaultPointInPolygonState } from './pointInPolygonScenes'
import { lineClippingScenes, defaultLineClippingState } from './lineClippingScenes'
import { rotatingCalipersScenes, defaultRotatingCalipersState } from './rotatingCalipersScenes'
import { earClippingScenes, defaultEarClippingState } from './earClippingScenes'
import { aStarScenes, defaultAStarState } from './aStarScenes'
import { stereographicProjectionScenes, defaultStereographicProjectionState } from './stereographicProjectionScenes'
import { hopfFibrationScenes, defaultHopfFibrationState } from './hopfFibrationScenes'
import { hyperbolicTilingScenes, defaultHyperbolicTilingState } from './hyperbolicTilingScenes'
import { spirographScenes, defaultSpirographState } from './spirographScenes'
import { eulerTotientScenes, defaultEulerTotientState } from './eulerTotientScenes'
import { mobiusFunctionScenes, defaultMobiusFunctionState } from './mobiusFunctionScenes'
import { fareySequenceScenes, defaultFareySequenceState } from './fareySequenceScenes'
import { sternBrocotScenes, defaultSternBrocotState } from './sternBrocotScenes'
import { primitiveRootScenes, defaultPrimitiveRootState } from './primitiveRootScenes'
import { fermatLittleScenes, defaultFermatLittleState } from './fermatLittleScenes'
import { wilsonTheoremScenes, defaultWilsonTheoremState } from './wilsonTheoremScenes'
import { fastExponentiationScenes, defaultFastExponentiationState } from './fastExponentiationScenes'
import { pythagoreanTriplesScenes, defaultPythagoreanTriplesState } from './pythagoreanTriplesScenes'
import { sumOfSquaresScenes, defaultSumOfSquaresState } from './sumOfSquaresScenes'
import { happyNumbersScenes, defaultHappyNumbersState } from './happyNumbersScenes'
import { kaprekarScenes, defaultKaprekarState } from './kaprekarScenes'
import { lucasNumbersScenes, defaultLucasNumbersState } from './lucasNumbersScenes'
import { triangularNumbersScenes, defaultTriangularNumbersState } from './triangularNumbersScenes'
import { frobeniusCoinScenes, defaultFrobeniusCoinState } from './frobeniusCoinScenes'
import { caesarCipherScenes, defaultCaesarCipherState } from './caesarCipherScenes'
import { vigenereCipherScenes, defaultVigenereCipherState } from './vigenereCipherScenes'
import { rsaCipherScenes, defaultRsaCipherState } from './rsaCipherScenes'
import { diffieHellmanScenes, defaultDiffieHellmanState } from './diffieHellmanScenes'
import { oneTimePadScenes, defaultOneTimePadState } from './oneTimePadScenes'
import { ellipticCurveScenes, defaultEllipticCurveState } from './ellipticCurveScenes'
import { josephusProblemScenes, defaultJosephusProblemState } from './josephusProblemScenes'
import { grayCodeScenes, defaultGrayCodeState } from './grayCodeScenes'
import { lookAndSayScenes, defaultLookAndSayState } from './lookAndSayScenes'
import { hillCipherScenes, defaultHillCipherState } from './hillCipherScenes'
import { luDecompositionScenes, defaultLuDecompositionState } from './luDecompositionScenes'
import { qrDecompositionScenes, defaultQrDecompositionState } from './qrDecompositionScenes'
import { choleskyScenes, defaultCholeskyState } from './choleskyScenes'
import { powerIterationScenes, defaultPowerIterationState } from './powerIterationScenes'
import { pagerankScenes, defaultPagerankState } from './pagerankScenes'
import { markovStationaryScenes, defaultMarkovStationaryState } from './markovStationaryScenes'
import { cramersRuleScenes, defaultCramersRuleState } from './cramersRuleScenes'
import { rotation3dScenes, defaultRotation3dState } from './rotation3dScenes'
import { gibbsPhenomenonScenes, defaultGibbsPhenomenonState } from './gibbsPhenomenonScenes'
import { chebyshevPolynomialsScenes, defaultChebyshevPolynomialsState } from './chebyshevPolynomialsScenes'
import { legendrePolynomialsScenes, defaultLegendrePolynomialsState } from './legendrePolynomialsScenes'
import { besselFunctionsScenes, defaultBesselFunctionsState } from './besselFunctionsScenes'
import { gammaFunctionScenes, defaultGammaFunctionState } from './gammaFunctionScenes'
import { fixedPointIterationScenes, defaultFixedPointIterationState } from './fixedPointIterationScenes'
import { secantMethodScenes, defaultSecantMethodState } from './secantMethodScenes'
import { bisectionMethodScenes, defaultBisectionMethodState } from './bisectionMethodScenes'
import { fftScenes, defaultFftState } from './fftScenes'
import { aliasingScenes, defaultAliasingState } from './aliasingScenes'
import { autocorrelationScenes, defaultAutocorrelationState } from './autocorrelationScenes'
import { convolutionScenes, defaultConvolutionState } from './convolutionScenes'
import { nyquistSamplingScenes, defaultNyquistSamplingState } from './nyquistSamplingScenes'
import { windowingScenes, defaultWindowingState } from './windowingScenes'
import { bSplineScenes, defaultBSplineState } from './bSplineScenes'
import { catmullRomScenes, defaultCatmullRomState } from './catmullRomScenes'
import { discreteCosineTransformScenes, defaultDiscreteCosineTransformState } from './discreteCosineTransformScenes'
import { stirlingNumbersScenes, defaultStirlingNumbersState } from './stirlingNumbersScenes'
import { bellNumbersScenes, defaultBellNumbersState } from './bellNumbersScenes'
import { derangementsScenes, defaultDerangementsState } from './derangementsScenes'
import { inclusionExclusionScenes, defaultInclusionExclusionState } from './inclusionExclusionScenes'
import { latinSquareScenes, defaultLatinSquareState } from './latinSquareScenes'
import { benfordsLawScenes, defaultBenfordsLawState } from './benfordsLawScenes'
import { buffonNeedleScenes, defaultBuffonNeedleState } from './buffonNeedleScenes'
import { galtonBoardScenes, defaultGaltonBoardState } from './galtonBoardScenes'
import { gamblersRuinScenes, defaultGamblersRuinState } from './gamblersRuinScenes'
import { couponCollectorScenes, defaultCouponCollectorState } from './couponCollectorScenes'
import { decisionTreeScenes, defaultDecisionTreeState } from './decisionTreeScenes'
import { knnScenes, defaultKnnState } from './knnScenes'
import { naiveBayesScenes, defaultNaiveBayesState } from './naiveBayesScenes'
import { logisticRegressionScenes, defaultLogisticRegressionState } from './logisticRegressionScenes'
import { backpropagationScenes, defaultBackpropagationState } from './backpropagationScenes'
import { softmaxScenes, defaultSoftmaxState } from './softmaxScenes'
import { geneticAlgorithmScenes, defaultGeneticAlgorithmState } from './geneticAlgorithmScenes'
import { particleSwarmScenes, defaultParticleSwarmState } from './particleSwarmScenes'
import { henonMapScenes, defaultHenonMapState } from './henonMapScenes'
import { rosslerAttractorScenes, defaultRosslerAttractorState } from './rosslerAttractorScenes'
import { tentMapScenes, defaultTentMapState } from './tentMapScenes'
import { projectileMotionScenes, defaultProjectileMotionState } from './projectileMotionScenes'
import { dampedOscillationScenes, defaultDampedOscillationState } from './dampedOscillationScenes'
import { catenaryScenes, defaultCatenaryState } from './catenaryScenes'
import { brachistochroneScenes, defaultBrachistochroneState } from './brachistochroneScenes'
import { WaveformScene } from './scenes/WaveformScene'
import { SpectrumScene } from './scenes/SpectrumScene'
import { FormulaScene } from './scenes/FormulaScene'
import { ComparisonScene } from './scenes/ComparisonScene'
import { TitleScene } from './scenes/TitleScene'
import { ApplicationScene } from './scenes/ApplicationScene'
import { IllustrationScene } from './scenes/IllustrationScene'
import { BasicArithmeticSceneRenderer } from './scenes/BasicArithmetic'
import type { BasicArithmeticState } from './scenes/BasicArithmetic/BasicArithmeticSceneRenderer'
import SceneRendererWrapper from './scenes/SceneRendererFactory'

interface NarrationPresenterProps {
  onExit: () => void
}

// 场景配置映射表
const sceneConfigMap: Record<string, {
  scenes: NarrationLineScene[]
  defaultState: SceneState
}> = {
  'fourier': { scenes: fourierScenes, defaultState: defaultFourierState },
  'basic-arithmetic': { scenes: basicArithmeticScenes, defaultState: defaultArithmeticState },
  'fractions': { scenes: fractionsScenes, defaultState: defaultFractionsState },
  'geometry-shapes': { scenes: geometryShapesScenes, defaultState: defaultGeometryState },
  'number-theory': { scenes: numberTheoryScenes, defaultState: defaultNumberTheoryState },
  'golden-ratio': { scenes: goldenRatioScenes, defaultState: defaultGoldenRatioState },
  'set-theory': { scenes: setTheoryScenes, defaultState: defaultSetTheoryState },
  'probability': { scenes: probabilityScenes, defaultState: defaultProbabilityState },
  'trigonometry': { scenes: trigonometryScenes, defaultState: defaultTrigonometryState },
  'pythagorean': { scenes: pythagoreanScenes, defaultState: defaultPythagoreanState },
  'quadratic-function': { scenes: quadraticScenes, defaultState: defaultQuadraticState },
  'linear-function': { scenes: linearScenes, defaultState: defaultLinearState },
  'polar': { scenes: polarScenes, defaultState: defaultPolarState },
  'bezier': { scenes: bezierScenes, defaultState: defaultBezierState },
  'monte-carlo': { scenes: monteCarloScenes, defaultState: defaultMonteCarloState },
  'bayes': { scenes: bayesScenes, defaultState: defaultBayesState },
  'calculus': { scenes: calculusScenes, defaultState: defaultCalculusState },
  'clt': { scenes: cltScenes, defaultState: defaultCltState },
  'complex': { scenes: complexScenes, defaultState: defaultComplexState },
  'conic-sections': { scenes: conicScenes, defaultState: defaultConicState },
  'parametric': { scenes: parametricScenes, defaultState: defaultParametricState },
  'regression': { scenes: regressionScenes, defaultState: defaultRegressionState },
  'taylor': { scenes: taylorScenes, defaultState: defaultTaylorState },
  // 新增21个高级实验
  'chaos': { scenes: chaosScenes, defaultState: defaultChaosState },
  'fourier-drawing': { scenes: fourierDrawingScenes, defaultState: defaultFourierDrawingState },
  'fourier-series': { scenes: fourierSeriesScenes, defaultState: defaultFourierSeriesState },
  'fractal': { scenes: fractalScenes, defaultState: defaultFractalState },
  'game-theory': { scenes: gameTheoryScenes, defaultState: defaultGameTheoryState },
  'gradient-descent': { scenes: gradientDescentScenes, defaultState: defaultGradientDescentState },
  'graph-theory': { scenes: graphTheoryScenes, defaultState: defaultGraphTheoryState },
  'heat-equation': { scenes: heatEquationScenes, defaultState: defaultHeatEquationState },
  'interpolation': { scenes: interpolationScenes, defaultState: defaultInterpolationState },
  'linear-algebra': { scenes: linearAlgebraScenes, defaultState: defaultLinearAlgebraState },
  'markov-chain': { scenes: markovChainScenes, defaultState: defaultMarkovChainState },
  'matrix-decomposition': { scenes: matrixDecompositionScenes, defaultState: defaultMatrixDecompositionState },
  'newton-method': { scenes: newtonMethodScenes, defaultState: defaultNewtonMethodState },
  'numerical-integration': { scenes: numericalIntegrationScenes, defaultState: defaultNumericalIntegrationState },
  'ode': { scenes: odeScenes, defaultState: defaultOdeState },
  'optimization': { scenes: optimizationScenes, defaultState: defaultOptimizationState },
  'pca': { scenes: pcaScenes, defaultState: defaultPcaState },
  'random-walk': { scenes: randomWalkScenes, defaultState: defaultRandomWalkState },
  'signal-processing': { scenes: signalProcessingScenes, defaultState: defaultSignalProcessingState },
  'vector-field': { scenes: vectorFieldScenes, defaultState: defaultVectorFieldState },
  'wave-equation': { scenes: waveEquationScenes, defaultState: defaultWaveEquationState },
  // 新增4个高级实验
  'pde': { scenes: pdeScenes, defaultState: defaultPdeState },
  'differential-geometry': { scenes: differentialGeometryScenes, defaultState: defaultDifferentialGeometryState },
  'numerical-analysis': { scenes: numericalAnalysisScenes, defaultState: defaultNumericalAnalysisState },
  'cryptography': { scenes: cryptographyScenes, defaultState: defaultCryptographyState },
  // 新增2个待完成课程
  'laplace': { scenes: laplaceScenes, defaultState: defaultLaplaceState },
  'permutation-combination': { scenes: permutationCombinationScenes, defaultState: defaultPermutationCombinationState },
  // 新增优美数学场景
  'game-of-life': { scenes: gameOfLifeScenes, defaultState: defaultGameOfLifeState },
  'euler-identity': { scenes: eulerIdentityScenes, defaultState: defaultEulerIdentityState },
  'three-body': { scenes: threeBodyScenes, defaultState: defaultThreeBodyState },
  'reaction-diffusion': { scenes: reactionDiffusionScenes, defaultState: defaultReactionDiffusionState },
  'mobius': { scenes: mobiusScenes, defaultState: defaultMobiusState },
  'cycloid': { scenes: cycloidScenes, defaultState: defaultCycloidState },
  'lissajous': { scenes: lissajousScenes, defaultState: defaultLissajousState },
  'ulam-spiral': { scenes: ulamSpiralScenes, defaultState: defaultUlamSpiralState },
  'pascal-triangle': { scenes: pascalTriangleScenes, defaultState: defaultPascalTriangleState },
  'voronoi': { scenes: voronoiScenes, defaultState: defaultVoronoiState },
  'l-system': { scenes: lSystemScenes, defaultState: defaultLSystemState },
  'even-odd': { scenes: evenOddScenes, defaultState: defaultEvenOddState },
  'roman-numerals': { scenes: romanNumeralsScenes, defaultState: defaultRomanNumeralsState },
  'symmetry': { scenes: symmetryScenes, defaultState: defaultSymmetryState },
  'tangram': { scenes: tangramScenes, defaultState: defaultTangramState },
  'clock-angles': { scenes: clockAnglesScenes, defaultState: defaultClockAnglesState },
  'inequalities': { scenes: inequalitiesScenes, defaultState: defaultInequalitiesState },
  'linear-system': { scenes: linearSystemScenes, defaultState: defaultLinearSystemState },
  'similar-triangles': { scenes: similarTrianglesScenes, defaultState: defaultSimilarTrianglesState },
  'circle-geometry': { scenes: circleGeometryScenes, defaultState: defaultCircleGeometryState },
  'stats-basics': { scenes: statsBasicsScenes, defaultState: defaultStatsBasicsState },
  'absolute-value': { scenes: absoluteValueScenes, defaultState: defaultAbsoluteValueState },
  'sequences': { scenes: sequencesScenes, defaultState: defaultSequencesState },
  'exponential-log': { scenes: exponentialLogScenes, defaultState: defaultExponentialLogState },
  'matrix-transform': { scenes: matrixTransformScenes, defaultState: defaultMatrixTransformState },
  'dot-cross-product': { scenes: dotCrossProductScenes, defaultState: defaultDotCrossProductState },
  'parabola-optics': { scenes: parabolaOpticsScenes, defaultState: defaultParabolaOpticsState },
  'sine-superposition': { scenes: sineSuperpositionScenes, defaultState: defaultSineSuperpositionState },
  'combinatorial-proof': { scenes: combinatorialProofScenes, defaultState: defaultCombinatorialProofState },
  'modular-arithmetic': { scenes: modularArithmeticScenes, defaultState: defaultModularArithmeticState },
  'continued-fraction': { scenes: continuedFractionScenes, defaultState: defaultContinuedFractionState },
  'epidemic-sir': { scenes: epidemicSirScenes, defaultState: defaultEpidemicSirState },
  'eigen-visualization': { scenes: eigenVisualizationScenes, defaultState: defaultEigenVisualizationState },
  'svd': { scenes: svdScenes, defaultState: defaultSvdState },
  'gram-schmidt': { scenes: gramSchmidtScenes, defaultState: defaultGramSchmidtState },
  'lagrange-multiplier': { scenes: lagrangeMultiplierScenes, defaultState: defaultLagrangeMultiplierState },
  'green-theorem': { scenes: greenTheoremScenes, defaultState: defaultGreenTheoremState },
  'residue-theorem': { scenes: residueTheoremScenes, defaultState: defaultResidueTheoremState },
  'power-series': { scenes: powerSeriesScenes, defaultState: defaultPowerSeriesState },
  'gaussian-process': { scenes: gaussianProcessScenes, defaultState: defaultGaussianProcessState },
  'kalman-filter': { scenes: kalmanFilterScenes, defaultState: defaultKalmanFilterState },
  'simulated-annealing': { scenes: simulatedAnnealingScenes, defaultState: defaultSimulatedAnnealingState },
  'mandelbrot-julia': { scenes: mandelbrotJuliaScenes, defaultState: defaultMandelbrotJuliaState },
  'double-pendulum': { scenes: doublePendulumScenes, defaultState: defaultDoublePendulumState },
  'lorenz-attractor': { scenes: lorenzAttractorScenes, defaultState: defaultLorenzAttractorState },
  'nbody-simulation': { scenes: nbodySimulationScenes, defaultState: defaultNbodySimulationState },
  'percolation': { scenes: percolationScenes, defaultState: defaultPercolationState },
  'cellular-automata': { scenes: cellularAutomataScenes, defaultState: defaultCellularAutomataState },
  'knot-theory': { scenes: knotTheoryScenes, defaultState: defaultKnotTheoryState },
  'wavelet': { scenes: waveletScenes, defaultState: defaultWaveletState },
  'sieve-eratosthenes': { scenes: sieveEratosthenesScenes, defaultState: defaultSieveEratosthenesState },
  'magic-square': { scenes: magicSquareScenes, defaultState: defaultMagicSquareState },
  'tower-of-hanoi': { scenes: towerOfHanoiScenes, defaultState: defaultTowerOfHanoiState },
  'pigeonhole': { scenes: pigeonholeScenes, defaultState: defaultPigeonholeState },
  'triangle-centers': { scenes: triangleCentersScenes, defaultState: defaultTriangleCentersState },
  'number-bases': { scenes: numberBasesScenes, defaultState: defaultNumberBasesState },
  'pythagoras-tree': { scenes: pythagorasTreeScenes, defaultState: defaultPythagorasTreeState },
  'tessellation': { scenes: tessellationScenes, defaultState: defaultTessellationState },
  'perfect-numbers': { scenes: perfectNumbersScenes, defaultState: defaultPerfectNumbersState },
  'collatz': { scenes: collatzScenes, defaultState: defaultCollatzState },
  'prime-factorization': { scenes: primeFactorizationScenes, defaultState: defaultPrimeFactorizationState },
  'fibonacci-nature': { scenes: fibonacciNatureScenes, defaultState: defaultFibonacciNatureState },
  'dice-probability': { scenes: diceProbabilityScenes, defaultState: defaultDiceProbabilityState },
  'nine-point-circle': { scenes: ninePointCircleScenes, defaultState: defaultNinePointCircleState },
  'euler-line': { scenes: eulerLineScenes, defaultState: defaultEulerLineState },
  'inversive-geometry': { scenes: inversiveGeometryScenes, defaultState: defaultInversiveGeometryState },
  'poincare-disk': { scenes: poincareDiskScenes, defaultState: defaultPoincareDiskState },
  'spherical-geometry': { scenes: sphericalGeometryScenes, defaultState: defaultSphericalGeometryState },
  'convex-hull': { scenes: convexHullScenes, defaultState: defaultConvexHullState },
  'delaunay-triangulation': { scenes: delaunayTriangulationScenes, defaultState: defaultDelaunayTriangulationState },
  'apollonian-gasket': { scenes: apollonianGasketScenes, defaultState: defaultApollonianGasketState },
  'pick-theorem': { scenes: pickTheoremScenes, defaultState: defaultPickTheoremState },
  'reuleaux': { scenes: reuleauxScenes, defaultState: defaultReuleauxState },
  'circle-packing': { scenes: circlePackingScenes, defaultState: defaultCirclePackingState },
  'steiner-chain': { scenes: steinerChainScenes, defaultState: defaultSteinerChainState },
  'polynomial-roots': { scenes: polynomialRootsScenes, defaultState: defaultPolynomialRootsState },
  'vieta-formulas': { scenes: vietaFormulasScenes, defaultState: defaultVietaFormulasState },
  'binomial-theorem': { scenes: binomialTheoremScenes, defaultState: defaultBinomialTheoremState },
  'inverse-function': { scenes: inverseFunctionScenes, defaultState: defaultInverseFunctionState },
  'composite-function': { scenes: compositeFunctionScenes, defaultState: defaultCompositeFunctionState },
  'partial-fractions': { scenes: partialFractionsScenes, defaultState: defaultPartialFractionsState },
  'rational-asymptotes': { scenes: rationalAsymptotesScenes, defaultState: defaultRationalAsymptotesState },
  'piecewise-function': { scenes: piecewiseFunctionScenes, defaultState: defaultPiecewiseFunctionState },
  'logarithm-spiral': { scenes: logarithmSpiralScenes, defaultState: defaultLogarithmSpiralState },
  'function-transform': { scenes: functionTransformScenes, defaultState: defaultFunctionTransformState },
  'euclidean-algorithm': { scenes: euclideanAlgorithmScenes, defaultState: defaultEuclideanAlgorithmState },
  'chinese-remainder': { scenes: chineseRemainderScenes, defaultState: defaultChineseRemainderState },
  'quadratic-residue': { scenes: quadraticResidueScenes, defaultState: defaultQuadraticResidueState },
  'gaussian-integers': { scenes: gaussianIntegersScenes, defaultState: defaultGaussianIntegersState },
  'integer-partition': { scenes: integerPartitionScenes, defaultState: defaultIntegerPartitionState },
  'pell-equation': { scenes: pellEquationScenes, defaultState: defaultPellEquationState },
  'prime-counting': { scenes: primeCountingScenes, defaultState: defaultPrimeCountingState },
  'digital-root': { scenes: digitalRootScenes, defaultState: defaultDigitalRootState },
  'epsilon-delta': { scenes: epsilonDeltaScenes, defaultState: defaultEpsilonDeltaState },
  'mean-value-theorem': { scenes: meanValueTheoremScenes, defaultState: defaultMeanValueTheoremState },
  'riemann-sum': { scenes: riemannSumScenes, defaultState: defaultRiemannSumState },
  'solid-of-revolution': { scenes: solidOfRevolutionScenes, defaultState: defaultSolidOfRevolutionState },
  'arc-length-curvature': { scenes: arcLengthCurvatureScenes, defaultState: defaultArcLengthCurvatureState },
  'series-convergence': { scenes: seriesConvergenceScenes, defaultState: defaultSeriesConvergenceState },
  'improper-integral': { scenes: improperIntegralScenes, defaultState: defaultImproperIntegralState },
  'determinant-geometry': { scenes: determinantGeometryScenes, defaultState: defaultDeterminantGeometryState },
  'kernel-image': { scenes: kernelImageScenes, defaultState: defaultKernelImageState },
  'orthogonal-projection': { scenes: orthogonalProjectionScenes, defaultState: defaultOrthogonalProjectionState },
  'least-squares': { scenes: leastSquaresScenes, defaultState: defaultLeastSquaresState },
  'quadratic-form': { scenes: quadraticFormScenes, defaultState: defaultQuadraticFormState },
  'spectral-theorem': { scenes: spectralTheoremScenes, defaultState: defaultSpectralTheoremState },
  'law-large-numbers': { scenes: lawLargeNumbersScenes, defaultState: defaultLawLargeNumbersState },
  'poisson-process': { scenes: poissonProcessScenes, defaultState: defaultPoissonProcessState },
  'brownian-motion': { scenes: brownianMotionScenes, defaultState: defaultBrownianMotionState },
  'monty-hall': { scenes: montyHallScenes, defaultState: defaultMontyHallState },
  'birthday-paradox': { scenes: birthdayParadoxScenes, defaultState: defaultBirthdayParadoxState },
  'hypothesis-testing': { scenes: hypothesisTestingScenes, defaultState: defaultHypothesisTestingState },
  'confidence-interval': { scenes: confidenceIntervalScenes, defaultState: defaultConfidenceIntervalState },
  'max-likelihood': { scenes: maxLikelihoodScenes, defaultState: defaultMaxLikelihoodState },
  'gaussian-mixture': { scenes: gaussianMixtureScenes, defaultState: defaultGaussianMixtureState },
  'hidden-markov': { scenes: hiddenMarkovScenes, defaultState: defaultHiddenMarkovState },
  'multiple-integral': { scenes: multipleIntegralScenes, defaultState: defaultMultipleIntegralState },
  'line-integral': { scenes: lineIntegralScenes, defaultState: defaultLineIntegralState },
  'divergence-curl': { scenes: divergenceCurlScenes, defaultState: defaultDivergenceCurlState },
  'stokes-theorem': { scenes: stokesTheoremScenes, defaultState: defaultStokesTheoremState },
  'partial-derivative': { scenes: partialDerivativeScenes, defaultState: defaultPartialDerivativeState },
  'directional-derivative': { scenes: directionalDerivativeScenes, defaultState: defaultDirectionalDerivativeState },
  'jacobian': { scenes: jacobianScenes, defaultState: defaultJacobianState },
  'vector-calculus-field': { scenes: vectorCalculusFieldScenes, defaultState: defaultVectorCalculusFieldState },
  'laplacian': { scenes: laplacianScenes, defaultState: defaultLaplacianState },
  'dijkstra': { scenes: dijkstraScenes, defaultState: defaultDijkstraState },
  'network-flow': { scenes: networkFlowScenes, defaultState: defaultNetworkFlowState },
  'graph-coloring': { scenes: graphColoringScenes, defaultState: defaultGraphColoringState },
  'euler-hamilton-path': { scenes: eulerHamiltonPathScenes, defaultState: defaultEulerHamiltonPathState },
  'sorting-algorithms': { scenes: sortingAlgorithmsScenes, defaultState: defaultSortingAlgorithmsState },
  'bfs-dfs': { scenes: bfsDfsScenes, defaultState: defaultBfsDfsState },
  'dynamic-programming': { scenes: dynamicProgrammingScenes, defaultState: defaultDynamicProgrammingState },
  'divide-conquer': { scenes: divideConquerScenes, defaultState: defaultDivideConquerState },
  'huffman-coding': { scenes: huffmanCodingScenes, defaultState: defaultHuffmanCodingState },
  'catalan-numbers': { scenes: catalanNumbersScenes, defaultState: defaultCatalanNumbersState },
  'generating-functions': { scenes: generatingFunctionsScenes, defaultState: defaultGeneratingFunctionsState },
  'minimum-spanning-tree': { scenes: minimumSpanningTreeScenes, defaultState: defaultMinimumSpanningTreeState },
  'logistic-bifurcation': { scenes: logisticBifurcationScenes, defaultState: defaultLogisticBifurcationState },
  'phase-portrait': { scenes: phasePortraitScenes, defaultState: defaultPhasePortraitState },
  'limit-cycle': { scenes: limitCycleScenes, defaultState: defaultLimitCycleState },
  'lotka-volterra': { scenes: lotkaVolterraScenes, defaultState: defaultLotkaVolterraState },
  'pendulum-phase': { scenes: pendulumPhaseScenes, defaultState: defaultPendulumPhaseState },
  'kepler-orbit': { scenes: keplerOrbitScenes, defaultState: defaultKeplerOrbitState },
  'vibrating-string': { scenes: vibratingStringScenes, defaultState: defaultVibratingStringState },
  'poincare-section': { scenes: poincareSectionScenes, defaultState: defaultPoincareSectionState },
  'euler-characteristic': { scenes: eulerCharacteristicScenes, defaultState: defaultEulerCharacteristicState },
  'torus-klein': { scenes: torusKleinScenes, defaultState: defaultTorusKleinState },
  'perceptron': { scenes: perceptronScenes, defaultState: defaultPerceptronState },
  'kmeans': { scenes: kmeansScenes, defaultState: defaultKmeansState },
  'neural-network-forward': { scenes: neuralNetworkForwardScenes, defaultState: defaultNeuralNetworkForwardState },
  'koch-snowflake': { scenes: kochSnowflakeScenes, defaultState: defaultKochSnowflakeState },
  'sierpinski-triangle': { scenes: sierpinskiTriangleScenes, defaultState: defaultSierpinskiTriangleState },
  'sierpinski-carpet': { scenes: sierpinskiCarpetScenes, defaultState: defaultSierpinskiCarpetState },
  'dragon-curve': { scenes: dragonCurveScenes, defaultState: defaultDragonCurveState },
  'barnsley-fern': { scenes: barnsleyFernScenes, defaultState: defaultBarnsleyFernState },
  'hilbert-curve': { scenes: hilbertCurveScenes, defaultState: defaultHilbertCurveState },
  'peano-curve': { scenes: peanoCurveScenes, defaultState: defaultPeanoCurveState },
  'gosper-curve': { scenes: gosperCurveScenes, defaultState: defaultGosperCurveState },
  'levy-c-curve': { scenes: levyCCurveScenes, defaultState: defaultLevyCCurveState },
  'newton-fractal': { scenes: newtonFractalScenes, defaultState: defaultNewtonFractalState },
  'burning-ship': { scenes: burningShipScenes, defaultState: defaultBurningShipState },
  'box-counting-dimension': { scenes: boxCountingDimensionScenes, defaultState: defaultBoxCountingDimensionState },
  'cantor-set': { scenes: cantorSetScenes, defaultState: defaultCantorSetState },
  'quadtree': { scenes: quadtreeScenes, defaultState: defaultQuadtreeState },
  'kd-tree': { scenes: kdTreeScenes, defaultState: defaultKdTreeState },
  'marching-squares': { scenes: marchingSquaresScenes, defaultState: defaultMarchingSquaresState },
  'point-in-polygon': { scenes: pointInPolygonScenes, defaultState: defaultPointInPolygonState },
  'line-clipping': { scenes: lineClippingScenes, defaultState: defaultLineClippingState },
  'rotating-calipers': { scenes: rotatingCalipersScenes, defaultState: defaultRotatingCalipersState },
  'ear-clipping': { scenes: earClippingScenes, defaultState: defaultEarClippingState },
  'a-star': { scenes: aStarScenes, defaultState: defaultAStarState },
  'stereographic-projection': { scenes: stereographicProjectionScenes, defaultState: defaultStereographicProjectionState },
  'hopf-fibration': { scenes: hopfFibrationScenes, defaultState: defaultHopfFibrationState },
  'hyperbolic-tiling': { scenes: hyperbolicTilingScenes, defaultState: defaultHyperbolicTilingState },
  'spirograph': { scenes: spirographScenes, defaultState: defaultSpirographState },
  'euler-totient': { scenes: eulerTotientScenes, defaultState: defaultEulerTotientState },
  'mobius-function': { scenes: mobiusFunctionScenes, defaultState: defaultMobiusFunctionState },
  'farey-sequence': { scenes: fareySequenceScenes, defaultState: defaultFareySequenceState },
  'stern-brocot': { scenes: sternBrocotScenes, defaultState: defaultSternBrocotState },
  'primitive-root': { scenes: primitiveRootScenes, defaultState: defaultPrimitiveRootState },
  'fermat-little': { scenes: fermatLittleScenes, defaultState: defaultFermatLittleState },
  'wilson-theorem': { scenes: wilsonTheoremScenes, defaultState: defaultWilsonTheoremState },
  'fast-exponentiation': { scenes: fastExponentiationScenes, defaultState: defaultFastExponentiationState },
  'pythagorean-triples': { scenes: pythagoreanTriplesScenes, defaultState: defaultPythagoreanTriplesState },
  'sum-of-squares': { scenes: sumOfSquaresScenes, defaultState: defaultSumOfSquaresState },
  'happy-numbers': { scenes: happyNumbersScenes, defaultState: defaultHappyNumbersState },
  'kaprekar': { scenes: kaprekarScenes, defaultState: defaultKaprekarState },
  'lucas-numbers': { scenes: lucasNumbersScenes, defaultState: defaultLucasNumbersState },
  'triangular-numbers': { scenes: triangularNumbersScenes, defaultState: defaultTriangularNumbersState },
  'frobenius-coin': { scenes: frobeniusCoinScenes, defaultState: defaultFrobeniusCoinState },
  'caesar-cipher': { scenes: caesarCipherScenes, defaultState: defaultCaesarCipherState },
  'vigenere-cipher': { scenes: vigenereCipherScenes, defaultState: defaultVigenereCipherState },
  'rsa-cipher': { scenes: rsaCipherScenes, defaultState: defaultRsaCipherState },
  'diffie-hellman': { scenes: diffieHellmanScenes, defaultState: defaultDiffieHellmanState },
  'one-time-pad': { scenes: oneTimePadScenes, defaultState: defaultOneTimePadState },
  'elliptic-curve': { scenes: ellipticCurveScenes, defaultState: defaultEllipticCurveState },
  'josephus-problem': { scenes: josephusProblemScenes, defaultState: defaultJosephusProblemState },
  'gray-code': { scenes: grayCodeScenes, defaultState: defaultGrayCodeState },
  'look-and-say': { scenes: lookAndSayScenes, defaultState: defaultLookAndSayState },
  'hill-cipher': { scenes: hillCipherScenes, defaultState: defaultHillCipherState },
  'lu-decomposition': { scenes: luDecompositionScenes, defaultState: defaultLuDecompositionState },
  'qr-decomposition': { scenes: qrDecompositionScenes, defaultState: defaultQrDecompositionState },
  'cholesky': { scenes: choleskyScenes, defaultState: defaultCholeskyState },
  'power-iteration': { scenes: powerIterationScenes, defaultState: defaultPowerIterationState },
  'pagerank': { scenes: pagerankScenes, defaultState: defaultPagerankState },
  'markov-stationary': { scenes: markovStationaryScenes, defaultState: defaultMarkovStationaryState },
  'cramers-rule': { scenes: cramersRuleScenes, defaultState: defaultCramersRuleState },
  'rotation3d': { scenes: rotation3dScenes, defaultState: defaultRotation3dState },
  'gibbs-phenomenon': { scenes: gibbsPhenomenonScenes, defaultState: defaultGibbsPhenomenonState },
  'chebyshev-polynomials': { scenes: chebyshevPolynomialsScenes, defaultState: defaultChebyshevPolynomialsState },
  'legendre-polynomials': { scenes: legendrePolynomialsScenes, defaultState: defaultLegendrePolynomialsState },
  'bessel-functions': { scenes: besselFunctionsScenes, defaultState: defaultBesselFunctionsState },
  'gamma-function': { scenes: gammaFunctionScenes, defaultState: defaultGammaFunctionState },
  'fixed-point-iteration': { scenes: fixedPointIterationScenes, defaultState: defaultFixedPointIterationState },
  'secant-method': { scenes: secantMethodScenes, defaultState: defaultSecantMethodState },
  'bisection-method': { scenes: bisectionMethodScenes, defaultState: defaultBisectionMethodState },
  'fft': { scenes: fftScenes, defaultState: defaultFftState },
  'aliasing': { scenes: aliasingScenes, defaultState: defaultAliasingState },
  'autocorrelation': { scenes: autocorrelationScenes, defaultState: defaultAutocorrelationState },
  'convolution': { scenes: convolutionScenes, defaultState: defaultConvolutionState },
  'nyquist-sampling': { scenes: nyquistSamplingScenes, defaultState: defaultNyquistSamplingState },
  'windowing': { scenes: windowingScenes, defaultState: defaultWindowingState },
  'b-spline': { scenes: bSplineScenes, defaultState: defaultBSplineState },
  'catmull-rom': { scenes: catmullRomScenes, defaultState: defaultCatmullRomState },
  'discrete-cosine-transform': { scenes: discreteCosineTransformScenes, defaultState: defaultDiscreteCosineTransformState },
  'stirling-numbers': { scenes: stirlingNumbersScenes, defaultState: defaultStirlingNumbersState },
  'bell-numbers': { scenes: bellNumbersScenes, defaultState: defaultBellNumbersState },
  'derangements': { scenes: derangementsScenes, defaultState: defaultDerangementsState },
  'inclusion-exclusion': { scenes: inclusionExclusionScenes, defaultState: defaultInclusionExclusionState },
  'latin-square': { scenes: latinSquareScenes, defaultState: defaultLatinSquareState },
  'benfords-law': { scenes: benfordsLawScenes, defaultState: defaultBenfordsLawState },
  'buffon-needle': { scenes: buffonNeedleScenes, defaultState: defaultBuffonNeedleState },
  'galton-board': { scenes: galtonBoardScenes, defaultState: defaultGaltonBoardState },
  'gamblers-ruin': { scenes: gamblersRuinScenes, defaultState: defaultGamblersRuinState },
  'coupon-collector': { scenes: couponCollectorScenes, defaultState: defaultCouponCollectorState },
  'decision-tree': { scenes: decisionTreeScenes, defaultState: defaultDecisionTreeState },
  'knn': { scenes: knnScenes, defaultState: defaultKnnState },
  'naive-bayes': { scenes: naiveBayesScenes, defaultState: defaultNaiveBayesState },
  'logistic-regression': { scenes: logisticRegressionScenes, defaultState: defaultLogisticRegressionState },
  'backpropagation': { scenes: backpropagationScenes, defaultState: defaultBackpropagationState },
  'softmax': { scenes: softmaxScenes, defaultState: defaultSoftmaxState },
  'genetic-algorithm': { scenes: geneticAlgorithmScenes, defaultState: defaultGeneticAlgorithmState },
  'particle-swarm': { scenes: particleSwarmScenes, defaultState: defaultParticleSwarmState },
  'henon-map': { scenes: henonMapScenes, defaultState: defaultHenonMapState },
  'rossler-attractor': { scenes: rosslerAttractorScenes, defaultState: defaultRosslerAttractorState },
  'tent-map': { scenes: tentMapScenes, defaultState: defaultTentMapState },
  'projectile-motion': { scenes: projectileMotionScenes, defaultState: defaultProjectileMotionState },
  'damped-oscillation': { scenes: dampedOscillationScenes, defaultState: defaultDampedOscillationState },
  'catenary': { scenes: catenaryScenes, defaultState: defaultCatenaryState },
  'brachistochrone': { scenes: brachistochroneScenes, defaultState: defaultBrachistochroneState },
}

// 检测是否为移动设备
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// 格式化时间 (秒 -> mm:ss)
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function NarrationPresenter({ onExit }: NarrationPresenterProps) {
  const {
    script,
    playbackState,
    voice,
    playbackRate,
    currentText,
    currentTime,
    totalDuration,
    togglePlay,
    nextLine,
    prevLine,
    jumpToLine,
    setVoice,
    setPlaybackRate,
    exitNarration,
  } = useNarration()

  // 获取当前稿件的场景配置
  const sceneConfig = useMemo(() => {
    const scriptId = script?.id || 'fourier'
    return sceneConfigMap[scriptId] || sceneConfigMap['fourier']
  }, [script?.id])

  // 场景状态 - 根据稿件类型初始化
  const [sceneState, setSceneState] = useState<SceneState>(defaultFourierState)

  // 当稿件变化时，重置场景状态
  useEffect(() => {
    setSceneState(sceneConfig.defaultState)
  }, [sceneConfig])

  // 移动端控制栏显示状态
  const isMobile = useIsMobile()
  const [controlsVisible, setControlsVisible] = useState(true)
  const hideTimerRef = useRef<number | null>(null)

  // 清除隐藏定时器
  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  // 启动隐藏定时器（3秒后隐藏）
  const startHideTimer = useCallback(() => {
    clearHideTimer()
    if (isMobile && playbackState.isPlaying) {
      hideTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false)
      }, 3000)
    }
  }, [isMobile, playbackState.isPlaying, clearHideTimer])

  // 播放状态变化时处理控制栏显示
  useEffect(() => {
    if (isMobile) {
      if (playbackState.isPlaying) {
        // 播放时启动隐藏定时器
        startHideTimer()
      } else {
        // 暂停时显示控制栏
        clearHideTimer()
        setControlsVisible(true)
      }
    }
  }, [isMobile, playbackState.isPlaying, startHideTimer, clearHideTimer])

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => clearHideTimer()
  }, [clearHideTimer])

  // 点击屏幕切换控制栏显示
  const handleScreenTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // 如果点击的是按钮或控制区域，不处理
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('select') || target.closest('.controls-area')) {
      return
    }

    if (isMobile) {
      setControlsVisible((prev) => {
        const newVisible = !prev
        if (newVisible && playbackState.isPlaying) {
          // 显示后启动隐藏定时器
          startHideTimer()
        }
        return newVisible
      })
    }
  }, [isMobile, playbackState.isPlaying, startHideTimer])

  // 获取当前场景配置
  const currentScene = useMemo((): NarrationLineScene | null => {
    if (!script) return null

    const section = script.sections[playbackState.currentSectionIndex]
    if (!section) return null

    const line = section.lines[playbackState.currentLineIndex]
    if (!line) return null

    return sceneConfig.scenes.find(
      (s) => s.sectionId === section.id && s.lineId === line.id
    ) || null
  }, [script, playbackState.currentSectionIndex, playbackState.currentLineIndex, sceneConfig.scenes])

  // 当场景变化时，更新状态
  useEffect(() => {
    if (currentScene?.scene.initialState) {
      setSceneState((prev) => ({
        ...prev,
        ...currentScene.scene.initialState,
      }))
    }
  }, [currentScene])

  // 更新场景状态
  const updateSceneState = useCallback((updates: Partial<SceneState>) => {
    setSceneState((prev) => ({ ...prev, ...updates }))
  }, [])

  // 处理退出
  const handleExit = useCallback(() => {
    exitNarration()
    onExit()
  }, [exitNarration, onExit])

  // 渲染场景内容
  const renderScene = () => {
    if (!currentScene) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-white/50 text-lg">加载中...</div>
        </div>
      )
    }

    const { scene } = currentScene
    const isInteractive = playbackState.isPlaying === false
    const scriptId = script?.id

    // 使用专属场景渲染器 - basic-arithmetic 有特殊处理
    if (scriptId === 'basic-arithmetic') {
      const arithmeticState: BasicArithmeticState = {
        operation: (sceneState as unknown as BasicArithmeticState).operation || 'addition',
        num1: (sceneState as unknown as BasicArithmeticState).num1 || 7,
        num2: (sceneState as unknown as BasicArithmeticState).num2 || 5,
        step: (sceneState as unknown as BasicArithmeticState).step || 0,
        showResult: (sceneState as unknown as BasicArithmeticState).showResult || false,
      }
      return (
        <BasicArithmeticSceneRenderer
          scene={currentScene}
          state={arithmeticState}
          onStateChange={(updates) => updateSceneState(updates as Partial<SceneState>)}
          isInteractive={isInteractive}
        />
      )
    }

    // 检查是否有专属场景渲染器（除了 fourier 使用默认渲染）
    const experimentsWithCustomRenderer = [
      'chaos', 'fractal', 'game-theory', 'taylor', 'calculus', 'bayes', 'clt',
      'complex', 'conic-sections', 'parametric', 'regression', 'fourier-drawing',
      'fourier-series', 'gradient-descent', 'graph-theory', 'heat-equation',
      'interpolation', 'linear-algebra', 'markov-chain', 'matrix-decomposition',
      'newton-method', 'numerical-integration', 'ode', 'optimization', 'pca',
      'random-walk', 'signal-processing', 'vector-field', 'wave-equation',
      'fractions', 'geometry-shapes', 'number-theory', 'golden-ratio', 'set-theory',
      'probability', 'trigonometry', 'pythagorean', 'quadratic-function',
      'linear-function', 'polar', 'bezier', 'monte-carlo',
      // 新增4个高级实验
      'pde', 'differential-geometry', 'numerical-analysis', 'cryptography',
      // 新增2个待完成课程
      'laplace', 'permutation-combination',
      // 新增优美数学场景
      'game-of-life', 'euler-identity', 'three-body', 'reaction-diffusion', 'mobius', 'cycloid', 'lissajous', 'ulam-spiral', 'pascal-triangle', 'voronoi', 'l-system', 'even-odd', 'roman-numerals', 'symmetry', 'tangram', 'clock-angles', 'inequalities', 'linear-system', 'similar-triangles', 'circle-geometry', 'stats-basics', 'absolute-value', 'sequences', 'exponential-log', 'matrix-transform', 'dot-cross-product', 'parabola-optics', 'sine-superposition', 'combinatorial-proof', 'modular-arithmetic', 'continued-fraction', 'epidemic-sir', 'eigen-visualization', 'svd', 'gram-schmidt', 'lagrange-multiplier', 'green-theorem', 'residue-theorem', 'power-series', 'gaussian-process', 'kalman-filter', 'simulated-annealing', 'mandelbrot-julia', 'double-pendulum', 'lorenz-attractor', 'nbody-simulation', 'percolation', 'cellular-automata', 'knot-theory', 'wavelet', 'sieve-eratosthenes', 'magic-square', 'tower-of-hanoi', 'pigeonhole', 'triangle-centers', 'number-bases', 'pythagoras-tree', 'tessellation', 'perfect-numbers', 'collatz', 'prime-factorization', 'fibonacci-nature', 'dice-probability', 'nine-point-circle', 'euler-line', 'inversive-geometry', 'poincare-disk', 'spherical-geometry', 'convex-hull', 'delaunay-triangulation', 'apollonian-gasket', 'pick-theorem', 'reuleaux', 'circle-packing', 'steiner-chain', 'polynomial-roots', 'vieta-formulas', 'binomial-theorem', 'inverse-function', 'composite-function', 'partial-fractions', 'rational-asymptotes', 'piecewise-function', 'logarithm-spiral', 'function-transform', 'euclidean-algorithm', 'chinese-remainder', 'quadratic-residue', 'gaussian-integers', 'integer-partition', 'pell-equation', 'prime-counting', 'digital-root', 'epsilon-delta', 'mean-value-theorem', 'riemann-sum', 'solid-of-revolution', 'arc-length-curvature', 'series-convergence', 'improper-integral', 'determinant-geometry', 'kernel-image', 'orthogonal-projection', 'least-squares', 'quadratic-form', 'spectral-theorem', 'law-large-numbers', 'poisson-process', 'brownian-motion', 'monty-hall', 'birthday-paradox', 'hypothesis-testing', 'confidence-interval', 'max-likelihood', 'gaussian-mixture', 'hidden-markov', 'multiple-integral', 'line-integral', 'divergence-curl', 'stokes-theorem', 'partial-derivative', 'directional-derivative', 'jacobian', 'vector-calculus-field', 'laplacian', 'dijkstra', 'network-flow', 'graph-coloring', 'euler-hamilton-path', 'sorting-algorithms', 'bfs-dfs', 'dynamic-programming', 'divide-conquer', 'huffman-coding', 'catalan-numbers', 'generating-functions', 'minimum-spanning-tree', 'logistic-bifurcation', 'phase-portrait', 'limit-cycle', 'lotka-volterra', 'pendulum-phase', 'kepler-orbit', 'vibrating-string', 'poincare-section', 'euler-characteristic', 'torus-klein', 'perceptron', 'kmeans', 'neural-network-forward', 'koch-snowflake', 'sierpinski-triangle', 'sierpinski-carpet', 'dragon-curve', 'barnsley-fern', 'hilbert-curve', 'peano-curve', 'gosper-curve', 'levy-c-curve', 'newton-fractal', 'burning-ship', 'box-counting-dimension', 'cantor-set', 'quadtree', 'kd-tree', 'marching-squares', 'point-in-polygon', 'line-clipping', 'rotating-calipers', 'ear-clipping', 'a-star', 'stereographic-projection', 'hopf-fibration', 'hyperbolic-tiling', 'spirograph', 'euler-totient', 'mobius-function', 'farey-sequence', 'stern-brocot', 'primitive-root', 'fermat-little', 'wilson-theorem', 'fast-exponentiation', 'pythagorean-triples', 'sum-of-squares', 'happy-numbers', 'kaprekar', 'lucas-numbers', 'triangular-numbers', 'frobenius-coin', 'caesar-cipher', 'vigenere-cipher', 'rsa-cipher', 'diffie-hellman', 'one-time-pad', 'elliptic-curve', 'josephus-problem', 'gray-code', 'look-and-say', 'hill-cipher', 'lu-decomposition', 'qr-decomposition', 'cholesky', 'power-iteration', 'pagerank', 'markov-stationary', 'cramers-rule', 'rotation3d', 'gibbs-phenomenon', 'chebyshev-polynomials', 'legendre-polynomials', 'bessel-functions', 'gamma-function', 'fixed-point-iteration', 'secant-method', 'bisection-method', 'fft', 'aliasing', 'autocorrelation', 'convolution', 'nyquist-sampling', 'windowing', 'b-spline', 'catmull-rom', 'discrete-cosine-transform', 'stirling-numbers', 'bell-numbers', 'derangements', 'inclusion-exclusion', 'latin-square', 'benfords-law', 'buffon-needle', 'galton-board', 'gamblers-ruin', 'coupon-collector', 'decision-tree', 'knn', 'naive-bayes', 'logistic-regression', 'backpropagation', 'softmax', 'genetic-algorithm', 'particle-swarm', 'henon-map', 'rossler-attractor', 'tent-map', 'projectile-motion', 'damped-oscillation', 'catenary', 'brachistochrone'
    ]

    if (scriptId && experimentsWithCustomRenderer.includes(scriptId)) {
      return (
        <SceneRendererWrapper
          experimentId={scriptId}
          scene={currentScene}
          isInteractive={isInteractive}
        />
      )
    }

    // 默认场景渲染（傅里叶等）
    switch (scene.type) {
      case 'title':
        return <TitleScene script={script} />

      case 'waveform':
      case 'animation':
      case 'interactive':
        return (
          <WaveformScene
            state={sceneState}
            onStateChange={updateSceneState}
            interactive={isInteractive ? scene.interactive : undefined}
            showAnimation={scene.type === 'animation'}
          />
        )

      case 'spectrum':
        return (
          <SpectrumScene
            state={sceneState}
            onStateChange={updateSceneState}
            interactive={isInteractive ? scene.interactive : undefined}
          />
        )

      case 'formula':
        return (
          <FormulaScene
            waveType={sceneState.waveType}
            terms={sceneState.terms}
          />
        )

      case 'comparison':
        return (
          <ComparisonScene
            state={sceneState}
            onStateChange={updateSceneState}
            interactive={isInteractive ? scene.interactive : undefined}
          />
        )

      case 'application':
        return (
          <ApplicationScene
            sceneId={scene.id}
          />
        )

      case 'illustration':
        if (scene.illustration) {
          return <IllustrationScene illustration={scene.illustration} />
        }
        return null

      case 'summary':
      case 'text':
      default:
        return (
          <WaveformScene
            state={sceneState}
            onStateChange={updateSceneState}
            interactive={isInteractive ? { allowWaveTypeChange: true, allowParamChange: true } : undefined}
          />
        )
    }
  }

  // 获取当前段落信息
  const currentSection = script?.sections[playbackState.currentSectionIndex]
  const totalLines = script?.sections.reduce((acc, s) => acc + s.lines.length, 0) || 0
  const currentLineNumber = (script?.sections
    .slice(0, playbackState.currentSectionIndex)
    .reduce((acc, s) => acc + s.lines.length, 0) || 0) + playbackState.currentLineIndex + 1

  // 控制栏显示/隐藏的样式类
  const controlsTransition = 'transition-all duration-300 ease-in-out'
  const controlsHiddenClass = isMobile && !controlsVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'

  // 下滑关闭手势
  const touchStartRef = useRef<{ y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches[0].clientY < window.innerHeight * 0.3) {
      touchStartRef.current = { y: e.touches[0].clientY }
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y
    touchStartRef.current = null
    if (deltaY > 120) handleExit()
  }, [handleExit])

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      onClick={handleScreenTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 移动端下滑指示条 */}
      <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 z-20 w-10 h-1 bg-white/30 rounded-full" />

      {/* 顶部信息栏 - 移动端可隐藏 */}
      <div
        className={`controls-area absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-gradient-to-b from-slate-900/95 to-transparent ${controlsTransition} ${controlsHiddenClass}`}
      >
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-base md:text-xl">📊</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm md:text-lg">{script?.title || '讲解模式'}</h1>
            <p className="text-white/50 text-xs md:text-sm hidden md:block">{currentSection?.title || ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* 进度指示 */}
          <div className="text-white/50 text-xs md:text-sm">
            {currentLineNumber} / {totalLines}
          </div>

          {/* 语音切换 - 移动端简化 */}
          <div className="hidden md:flex items-center gap-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setVoice('xiaoxiao')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                voice === 'xiaoxiao'
                  ? 'bg-pink-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              晓晓♀
            </button>
            <button
              onClick={() => setVoice('yunxi')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                voice === 'yunxi'
                  ? 'bg-blue-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              云希♂
            </button>
          </div>

          {/* 移动端语音切换按钮 */}
          <button
            onClick={() => setVoice(voice === 'xiaoxiao' ? 'yunxi' : 'xiaoxiao')}
            className={`md:hidden px-2 py-1.5 rounded-lg text-xs font-medium ${
              voice === 'xiaoxiao' ? 'bg-pink-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {voice === 'xiaoxiao' ? '♀' : '♂'}
          </button>

          {/* 播放速度 - 移动端隐藏 */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            className="hidden md:block bg-white/10 text-white text-sm rounded-lg px-3 py-2 border-0 focus:ring-2 focus:ring-indigo-500"
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
          </select>

          {/* 退出按钮 */}
          <button
            onClick={handleExit}
            className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-all text-sm font-medium"
          >
            退出
          </button>
        </div>
      </div>

      {/* 主内容区 - 移动端全屏 */}
      <div className="absolute inset-0 flex flex-col">
        {/* 可视化区域 - 移动端占满屏幕 */}
        <div className="flex-1 md:m-6 md:mt-20 md:mb-4 md:rounded-2xl overflow-hidden bg-white/5">
          {renderScene()}
        </div>

        {/* 字幕区域 - 移动端底部悬浮，桌面端固定位置 */}
        <div
          className={`absolute left-0 right-0 ${isMobile ? 'bottom-24' : 'bottom-20'} mx-4 md:mx-6 bg-black/60 md:bg-white/10 backdrop-blur-sm rounded-xl px-4 md:px-6 py-3 md:py-4 ${controlsTransition} ${isMobile && !controlsVisible ? 'bottom-4' : ''}`}
        >
          {/* 进度条 */}
          <div className="mb-2">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span className="flex-1 text-center">{currentSection?.title}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
            <div
              className="h-1.5 bg-white/20 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const percent = x / rect.width
                const targetLine = Math.floor(percent * totalLines)
                // 计算目标 section 和 line
                let count = 0
                for (let si = 0; si < (script?.sections.length || 0); si++) {
                  const section = script?.sections[si]
                  if (!section) continue
                  for (let li = 0; li < section.lines.length; li++) {
                    if (count === targetLine) {
                      jumpToLine(si, li)
                      return
                    }
                    count++
                  }
                }
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}%` }}
              />
            </div>
          </div>
          <p className="text-white text-sm md:text-lg leading-relaxed text-center">
            {currentText || '准备开始...'}
          </p>
        </div>
      </div>

      {/* 底部控制栏 - 移动端可隐藏 */}
      <div
        className={`controls-area absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 md:gap-6 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-t from-slate-900/95 to-transparent ${controlsTransition} ${controlsHiddenClass}`}
      >
        {/* 上一句 */}
        <button
          onClick={prevLine}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>

        {/* 播放/暂停 */}
        <button
          onClick={togglePlay}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center"
        >
          {playbackState.isPlaying ? (
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-7 h-7 md:w-8 md:h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* 下一句 */}
        <button
          onClick={nextLine}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
          </svg>
        </button>

        {/* 移动端播放速度按钮 */}
        <button
          onClick={() => {
            const rates = [0.75, 1, 1.25, 1.5]
            const currentIndex = rates.indexOf(playbackRate)
            const nextIndex = (currentIndex + 1) % rates.length
            setPlaybackRate(rates[nextIndex])
          }}
          className="md:hidden w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center text-xs font-medium"
        >
          {playbackRate}x
        </button>
      </div>

      {/* 暂停时的交互提示 - 移动端调整位置 */}
      {!playbackState.isPlaying && currentScene?.scene.interactive && (
        <div className={`absolute ${isMobile ? 'bottom-40' : 'bottom-28'} left-1/2 -translate-x-1/2 bg-indigo-500/90 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm animate-pulse`}>
          暂停中 - 可以交互探索
        </div>
      )}

      {/* 移动端点击提示 - 仅在控制栏隐藏时显示 */}
      {isMobile && !controlsVisible && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">
          点击屏幕显示控制
        </div>
      )}
    </div>
  )
}
