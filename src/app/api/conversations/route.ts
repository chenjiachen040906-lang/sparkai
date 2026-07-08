/**
 * /api/conversations - 会话管理接口
 * 目前基于内存存储，生产环境建议接入数据库
 */
import { NextRequest, NextResponse } from 'next/server';

// 简单的内存存储（生产环境请使用数据库）
let conversations: any[] = [];

export async function GET() {
  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conversation = {
      id: crypto.randomUUID(),
      title: body.title || '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    conversations.unshift(conversation);
    return NextResponse.json(conversation, { status: 201 });
  } catch {
    return NextResponse.json({ error: '创建失败' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: '缺少 ID 参数' }, { status: 400 });
    }
    conversations = conversations.filter((c) => c.id !== id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '删除失败' }, { status: 400 });
  }
}
