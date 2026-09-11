import { getAllProducts } from "@/src/lib/products";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { scentType, occasion, budget } = await request.json();
  const products = await getAllProducts();

  const prompt = `
Bạn là chuyên gia tư vấn nước hoa. Dựa trên catalog sản phẩm sau (JSON):
${JSON.stringify(products)}

Khách hàng yêu cầu:
- Loại hương thích: ${scentType}
- Dịp dùng: ${occasion}
- Ngân sách: ${budget}

Chọn tối đa 3 sản phẩm phù hợp nhất (chỉ chọn ID có thật trong catalog).
Trả về DUY NHẤT JSON: {"recommendations": [{"id": số, "reason": "lý do ngắn gọn"}]}
`;

  const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const aiData = await aiResponse.json();

  try {
    const text = aiData.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(clean));
  } catch {
    return NextResponse.json(
      { error: "AI trả về sai định dạng" },
      { status: 500 },
    );
  }
}
