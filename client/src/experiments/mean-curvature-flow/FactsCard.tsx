/**
 * 平均曲率流的解析解与性质卡片
 *
 * 从 Experiment 抽出来, 让主组件保持在 100 行以内。
 */
import { sphereExtinctionTime, cylinderCollapseTime } from './meanCurvatureFlow'

export default function FactsCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-3">解析解与性质</h3>
      <ul className="text-sm text-gray-600 space-y-1.5">
        <li>
          • 单位球面 <b>R(t)=√(1−4t)</b>，消失于 t = <b>{sphereExtinctionTime(1)}</b>
        </li>
        <li>
          • 单位圆柱 <b>R(t)=√(1−2t)</b>，坍塌于 t = <b>{cylinderCollapseTime(1)}</b>
          （球面的两倍）
        </li>
        <li>• <b>球面自相似收缩</b>：过程中始终是球，形状不变。</li>
        <li>• <b>细腰先断</b>：曲率大处收缩快，哑铃在腰部形成奇点。</li>
        <li>• <b>面积与体积单调减少</b>，这是流的必然性质，可作正确性检验。</li>
      </ul>
    </div>
  )
}
