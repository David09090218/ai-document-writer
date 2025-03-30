import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { type, prompt } = await request.json()

    const systemPrompt = `你是一个专业的公文写作助手。请根据用户的需求，生成一篇符合规范的公文。
    公文类型：${type}
    要求：
    1. 遵循公文写作规范
    2. 语言简洁明了
    3. 格式规范
    4. 内容专业
    5. 结构完整`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt || "请生成一篇公文" }
      ],
      temperature: 0.7,
    })

    return NextResponse.json({ content: completion.choices[0].message.content })
  } catch (error) {
    console.error('Error generating document:', error)
    return NextResponse.json(
      { error: '生成文档时发生错误' },
      { status: 500 }
    )
  }
} 