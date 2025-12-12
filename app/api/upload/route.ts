import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const stationId = formData.get('stationId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    if (!stationId) {
      return NextResponse.json(
        { error: 'Se requiere el ID de la estación' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no válido. Use JPG, PNG, GIF o WebP' },
        { status: 400 }
      );
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 5MB' },
        { status: 400 }
      );
    }

    // Convertir el archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear directorio si no existe
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'stations');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directorio ya existe
    }

    // Generar nombre de archivo único
    const extension = file.name.split('.').pop();
    const filename = `${stationId}-${Date.now()}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Guardar archivo
    await writeFile(filepath, buffer);

    // Retornar URL pública
    const publicUrl = `/uploads/stations/${filename}`;

    return NextResponse.json({
      message: 'Archivo subido exitosamente',
      url: publicUrl,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 }
    );
  }
}