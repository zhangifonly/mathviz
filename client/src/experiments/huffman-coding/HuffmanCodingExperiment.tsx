import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { huffmanCodingNarration } from '../../narrations/scripts/huffman-coding'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { countFrequencies, buildHuffmanTree, generateCodes, encodedBits, fixedBits, SAMPLE_TEXTS } from './huffmanCoding'
import { drawHuffmanCoding } from './draw'

const W = 600
const H = 480

export default function HuffmanCodingExperiment() {
  const [text, setText] = useState(SAMPLE_TEXTS[0])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(huffmanCodingNarration)
  }, [narration])

  const freq = countFrequencies(text)
  const codes = generateCodes(buildHuffmanTree(freq))
  const huff = encodedBits(freq, codes)
  const fixed = fixedBits(freq)
  const ratio = fixed > 0 ? Math.round((huff / fixed) * 100) : 0

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawHuffmanCoding(canvas, buildHuffmanTree(countFrequencies(text)))
  }, [text])

  const chars = Object.keys(codes).sort((a, b) => freq[b] - freq[a])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">哈夫曼编码</h1>
            <p className="text-gray-600">最优前缀码压缩</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">哈夫曼树 · 左 0 右 1</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择文本</h3>
              <div className="space-y-2">
                {SAMPLE_TEXTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setText(t)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-mono text-left ${text === t ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">编码表</h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm font-mono">
                {chars.map((ch) => (
                  <div key={ch} className="flex justify-between">
                    <span className="text-gray-500">{ch === ' ' ? '␣' : ch}({freq[ch]})</span>
                    <span className="text-indigo-600">{codes[ch]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">压缩效果</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 定长编码: <b>{fixed}</b> 位</li>
                <li>• 哈夫曼编码: <b className="text-emerald-600">{huff}</b> 位</li>
                <li>• 占用比例: <b>{ratio}%</b>（越小越省）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
