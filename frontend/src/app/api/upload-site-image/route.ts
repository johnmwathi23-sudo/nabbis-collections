import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const alt = formData.get('alt') as string;
    const category = formData.get('category') as string;

    if (!file || !name || !alt || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'site-images');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const imageData = {
      id: Date.now().toString(),
      name,
      path: `/uploads/site-images/${filename}`,
      alt,
      category,
      uploadedAt: new Date().toISOString(),
      size: file.size,
    };

    return NextResponse.json(imageData, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID required' },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'site-images');
    const filepath = join(uploadDir, `${id}.jpg`);

    if (existsSync(filepath)) {
      await import('fs/promises').then(fs => fs.unlink(filepath));
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
