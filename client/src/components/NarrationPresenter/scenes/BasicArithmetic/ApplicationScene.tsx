/**
 * 应用场景 - 展示实际应用案例
 */

interface Props {
  sceneId: string
}

const applications: Record<string, { icon: string; title: string; desc: string }> = {
  'app-shopping': {
    icon: '🛒',
    title: '购物计算',
    desc: '买 3 个苹果，每个 2 元，一共多少钱？',
  },
  'app-sharing': {
    icon: '🍰',
    title: '分蛋糕',
    desc: '8 块蛋糕平均分给 4 个人，每人几块？',
  },
  'app-counting': {
    icon: '📚',
    title: '数书本',
    desc: '书架上有 5 本书，又放了 3 本，现在有几本？',
  },
  'app-game': {
    icon: '🎮',
    title: '游戏得分',
    desc: '第一关得 100 分，第二关得 150 分，总分多少？',
  },
}

export default function ApplicationScene({ sceneId }: Props) {
  const app = applications[sceneId] || applications['app-shopping']

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700">
      <div className="text-center p-8">
        <div className="text-8xl mb-6">{app.icon}</div>
        <h2 className="text-3xl font-bold text-white mb-4">{app.title}</h2>
        <p className="text-xl text-white/80 max-w-md">{app.desc}</p>
      </div>
    </div>
  )
}
