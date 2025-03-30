'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const documentTypes = [
  { id: 'notice', name: '通知', description: '用于发布重要事项或要求' },
  { id: 'report', name: '报告', description: '用于汇报工作或情况' },
  { id: 'request', name: '请示', description: '用于向上级请求指示或批准' },
  { id: 'summary', name: '总结', description: '用于总结工作或活动' },
]

export default function WritePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WritePageContent />
    </Suspense>
  )
}

function WritePageContent() {
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState('')
  const [content, setContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    const type = searchParams.get('type')
    if (type) {
      setSelectedType(type)
    }
  }, [searchParams])

  const generateDocument = async () => {
    if (!selectedType) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          prompt: prompt,
        }),
      })

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setContent(data.content)
    } catch (error) {
      console.error('Error generating document:', error)
      setContent('生成文档时发生错误，请稍后重试。')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">公文写作</h1>
          <p className="mt-2 text-gray-600">选择文档类型，AI将帮您生成专业公文</p>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {documentTypes.map((type) => (
              <div
                key={type.id}
                className={`relative rounded-lg border p-6 cursor-pointer transition-colors ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <h3 className="mt-4 text-lg font-medium text-gray-900">{type.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                  写作提示（可选）
                </label>
                <textarea
                  id="prompt"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="请输入写作提示，例如：关于召开年度总结会议的通知"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">文档内容</h2>
                <button
                  onClick={generateDocument}
                  disabled={!selectedType || isGenerating}
                  className={`px-4 py-2 rounded-md text-white ${
                    !selectedType || isGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isGenerating ? '生成中...' : '生成文档'}
                </button>
              </div>
              <div className="border rounded-md p-4 min-h-[300px] bg-gray-50 whitespace-pre-wrap">
                {content || '选择文档类型后点击生成按钮开始写作'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 