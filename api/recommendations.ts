// 文件名: api/recommendations.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

// 强制 Vercel 使用 Node.js 运行时
export const config = {
  runtime: "nodejs",
};

/**
 * Vercel Serverless Function 处理程序：
 * 接收 POST 请求，调用 Gemini API 获取电影推荐，并解析为 JSON 数组返回。
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  // 1. 检查请求方法：只允许 POST
  if (req.method !== "POST") {
    // 返回 405 状态码 (Method Not Allowed)
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.API_KEY; // 确保您的 Vercel 环境变量中设置了 API_KEY

    // 2. 检查 API Key
    if (!apiKey) {
      console.error("Missing Gemini API key in environment variables.");
      return res.status(500).json({ message: "Missing Gemini API key on server." });
    }

    // 3. 定义系统指令和 JSON Schema，强制模型返回结构化数据
    const systemInstruction = `你是一个电影推荐专家，请根据用户的描述，以纯 JSON 数组格式返回 3-4 部电影。每部电影对象必须包含 'title' (电影名称) 和 'year' (上映年份) 两个字段。请勿输出任何其他文字、解释或 Markdown 格式（如 \`\`\`json 标签），仅返回 JSON 数组。`;
    
    // JSON Schema 确保模型的输出格式符合前端 MovieTitle[] 接口
    const responseSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          year: { type: "integer" }
        },
        required: ["title", "year"]
      }
    };
    
    // 4. 调用 Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] },
          ],
          config: {
            systemInstruction: systemInstruction,
            // 开启 JSON 模式，并指定 Schema
            responseMimeType: "application/json",
            responseSchema: responseSchema 
          }
        }),
      }
    );

    // 5. 检查 Gemini API 响应状态
    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini API returned error status ${response.status}: ${errText}`);
      return res.status(502).json({ 
        message: "Gemini API call failed.", 
        details: `Status: ${response.status}` 
      });
    }

    const data = await response.json();
    
    // 6. 提取 Gemini 的文本内容 (JSON 字符串)
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!geminiText) {
        console.error("Gemini API returned no parsable text content.");
        return res.status(500).json({ message: "Gemini API returned no content for parsing." });
    }
    
    // 7. 解析文本为 JSON 数组
    const movieList = JSON.parse(geminiText); 

    // 8. 返回最终的电影列表数组给前端
    return res.status(200).json(movieList);

  } catch (error) {
    // 9. 处理所有其他错误 (网络错误、JSON 解析错误等)
    console.error("Error in /api/recommendations:", error);
    return res.status(500).json({ message: "Internal server error during recommendation process." });
  }
}
