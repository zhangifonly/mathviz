/**
 * 应用场景组件
 *
 * 展示傅里叶变换的实际应用
 */

interface ApplicationSceneProps {
  sceneId: string
}

const applications = {
  'app-audio': {
    title: '音频处理',
    icon: '🎵',
    description: '音乐均衡器、降噪、音频压缩',
    details: [
      '将音频信号分解为不同频率成分',
      '调节各频段的音量（低音、中音、高音）',
      '识别并去除噪声频率',
      'MP3 等格式利用频域压缩',
    ],
    color: 'from-pink-500 to-rose-500',
  },
  'app-image': {
    title: '图像处理',
    icon: '🖼️',
    description: 'JPEG 压缩、滤波、边缘检测',
    details: [
      '2D 傅里叶变换分析图像频率',
      '低频 = 平滑区域，高频 = 边缘细节',
      'JPEG 使用 DCT（离散余弦变换）压缩',
      '频域滤波实现模糊、锐化效果',
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  'app-comm': {
    title: '通信系统',
    icon: '📡',
    description: '调制解调、频谱分析、信道复用',
    details: [
      '将信号调制到载波频率上传输',
      '频分复用（FDM）让多路信号共享信道',
      '频谱分析检测干扰和噪声',
      '5G、WiFi 都依赖频域技术',
    ],
    color: 'from-green-500 to-emerald-500',
  },
  'app-medical': {
    title: '医学成像',
    icon: '🏥',
    description: 'MRI、CT、超声波成像',
    details: [
      'MRI 直接在频域采集数据（k-space）',
      '傅里叶变换重建人体图像',
      'CT 使用滤波反投影算法',
      '超声波利用多普勒频移检测血流',
    ],
    color: 'from-purple-500 to-violet-500',
  },
  default: {
    title: '傅里叶变换的应用',
    icon: '🌐',
    description: '无处不在的数学工具',
    details: [
      '音频处理：均衡器、降噪、压缩',
      '图像处理：JPEG、滤波、边缘检测',
      '通信系统：调制、频谱分析',
      '医学成像：MRI、CT 重建',
    ],
    color: 'from-indigo-500 to-purple-500',
  },
}

export function ApplicationScene({ sceneId }: ApplicationSceneProps) {
  const app = applications[sceneId as keyof typeof applications] || applications.default

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      {/* 图标和标题 */}
      <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-6 shadow-xl`}>
        <span className="text-5xl">{app.icon}</span>
      </div>

      <h2 className="text-3xl font-bold text-white mb-2">{app.title}</h2>
      <p className="text-white/70 text-lg mb-8">{app.description}</p>

      {/* 详细说明 */}
      <div className="bg-white/10 rounded-2xl p-6 max-w-2xl w-full">
        <ul className="space-y-4">
          {app.details.map((detail, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${app.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <span className="text-white/90">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 底部装饰 */}
      <div className="mt-8 flex items-center gap-4">
        {Object.entries(applications)
          .filter(([key]) => key !== 'default')
          .map(([key, value]) => (
            <div
              key={key}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                key === sceneId
                  ? `bg-gradient-to-br ${value.color} shadow-lg scale-110`
                  : 'bg-white/10 opacity-50'
              }`}
            >
              <span className="text-2xl">{value.icon}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
