import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Проверка типа файла
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.'
        },
        { status: 400 }
      )
    }

    // Проверка размера (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: 'File too large. Maximum size is 10MB.'
        },
        { status: 400 }
      )
    }

    // Загружаем в Vercel Blob
    const blob = await put(
      `screenshots/${Date.now()}-${file.name}`,
      file,
      {
        access: 'public'
      }
    )

    return NextResponse.json({
      url: blob.url,
      filename: file.name
    })
  } catch (error) {
    console.error('POST /api/upload error:', error)

    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}