import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './experiments/Home'
import FourierExperiment from './experiments/fourier/FourierExperiment'
import TrigExperiment from './experiments/trigonometry/TrigExperiment'
import CalculusExperiment from './experiments/calculus/CalculusExperiment'
import LinearAlgebraExperiment from './experiments/linear-algebra/LinearAlgebraExperiment'
import ComplexExperiment from './experiments/complex/ComplexExperiment'
import TaylorExperiment from './experiments/taylor/TaylorExperiment'
import PolarExperiment from './experiments/polar/PolarExperiment'
import ParametricExperiment from './experiments/parametric/ParametricExperiment'
import ODEExperiment from './experiments/ode/ODEExperiment'
import ProbabilityExperiment from './experiments/probability/ProbabilityExperiment'
import CLTExperiment from './experiments/clt/CLTExperiment'
import MonteCarloExperiment from './experiments/monte-carlo/MonteCarloExperiment'
import FractalExperiment from './experiments/fractal/FractalExperiment'
import GoldenRatioExperiment from './experiments/golden-ratio/GoldenRatioExperiment'
import NewtonMethodExperiment from './experiments/newton-method/NewtonMethodExperiment'
import GradientDescentExperiment from './experiments/gradient-descent/GradientDescentExperiment'
import FourierDrawingExperiment from './experiments/fourier-drawing/FourierDrawingExperiment'
import BayesExperiment from './experiments/bayes/BayesExperiment'
import GraphTheoryExperiment from './experiments/graph-theory/GraphTheoryExperiment'
import VectorFieldExperiment from './experiments/vector-field/VectorFieldExperiment'
import WaveEquationExperiment from './experiments/wave-equation/WaveEquationExperiment'
import ChaosExperiment from './experiments/chaos/ChaosExperiment'
import NumberTheoryExperiment from './experiments/number-theory/NumberTheoryExperiment'
import SetTheoryExperiment from './experiments/set-theory/SetTheoryExperiment'
import MatrixDecompositionExperiment from './experiments/matrix-decomposition/MatrixDecompositionExperiment'
import SignalProcessingExperiment from './experiments/signal-processing/SignalProcessingExperiment'
import GameTheoryExperiment from './experiments/game-theory/GameTheoryExperiment'
import RegressionExperiment from './experiments/regression/RegressionExperiment'
import OptimizationExperiment from './experiments/optimization/OptimizationExperiment'
import NumericalIntegrationExperiment from './experiments/numerical-integration/NumericalIntegrationExperiment'
import InterpolationExperiment from './experiments/interpolation/InterpolationExperiment'
import MarkovChainExperiment from './experiments/markov-chain/MarkovChainExperiment'
import FourierSeriesExperiment from './experiments/fourier-series/FourierSeriesExperiment'
import PCAExperiment from './experiments/pca/PCAExperiment'
import HeatEquationExperiment from './experiments/heat-equation/HeatEquationExperiment'
import RandomWalkExperiment from './experiments/random-walk/RandomWalkExperiment'
import BezierExperiment from './experiments/bezier/BezierExperiment'
import BasicArithmeticExperiment from './experiments/basic-arithmetic/BasicArithmeticExperiment'
import FractionsExperiment from './experiments/fractions/FractionsExperiment'
import GeometryShapesExperiment from './experiments/geometry-shapes/GeometryShapesExperiment'
import LinearFunctionExperiment from './experiments/linear-function/LinearFunctionExperiment'
import QuadraticFunctionExperiment from './experiments/quadratic-function/QuadraticFunctionExperiment'
import PythagoreanExperiment from './experiments/pythagorean/PythagoreanExperiment'
import ConicSectionsExperiment from './experiments/conic-sections/ConicSectionsExperiment'

export default function App() {
  return (
    <BrowserRouter>
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
