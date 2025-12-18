'use server';

import { revalidatePath } from 'next/cache';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { Station } from './types';

const STATIONS_FILE_PATH = path.join(process.cwd(), 'data', 'stations.json');

// ========================================
// FUNCIONES PÚBLICAS (Para todas las páginas)
// ========================================

/**
 * Lee todas las estaciones activas desde el archivo JSON
 * Esta función se ejecuta en el servidor durante el build
 */
export async function getAllStations(): Promise<Station[]> {
  try {
    const fileContent = await fs.readFile(STATIONS_FILE_PATH, 'utf-8');
    const stations: Station[] = JSON.parse(fileContent);
    // Solo retornar estaciones activas
    return stations.filter(station => station.isActive !== false);
  } catch (error) {
    console.error('Error reading stations file:', error);
    // Si el archivo no existe o hay error, retornar array vacío
    return [];
  }
}

/**
 * Obtiene una estación por ID
 */
export async function getStationById(id: string): Promise<Station | null> {
  const stations = await getAllStations();
  return stations.find(station => station.id === id) || null;
}

/**
 * Obtiene todos los IDs de estaciones (útil para generateStaticParams)
 */
export async function getAllStationIds(): Promise<string[]> {
  const stations = await getAllStations();
  return stations.map(station => station.id);
}

// ========================================
// FUNCIONES ADMINISTRATIVAS (Solo para panel admin)
// ========================================

/**
 * Lee todas las estaciones incluyendo las inactivas (solo para admin)
 */
export async function getAllStationsIncludingInactive(): Promise<Station[]> {
  try {
    const fileContent = await fs.readFile(STATIONS_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading stations file:', error);
    return [];
  }
}

/**
 * Guarda el array completo de estaciones
 */
async function saveStations(stations: Station[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  
  // Crear directorio si no existe
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  await fs.writeFile(
    STATIONS_FILE_PATH, 
    JSON.stringify(stations, null, 2), 
    'utf-8'
  );
}

/**
 * Guarda una imagen en el sistema de archivos y la convierte a WebP
 */
async function saveImage(file: File): Promise<string> {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'stations');
    
    // Crear directorio si no existe
    try {
      await fs.access(imagesDir);
    } catch {
      await fs.mkdir(imagesDir, { recursive: true });
    }

    // Generar nombre único para la imagen (siempre .webp)
    const timestamp = Date.now();
    const fileName = `station-${timestamp}.webp`;
    const filePath = path.join(imagesDir, fileName);

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convertir a WebP usando Sharp
    await sharp(buffer)
      .webp({ quality: 85 }) // Calidad 85% (buen balance entre tamaño y calidad)
      .resize(800, 800, { // Redimensionar a máximo 800x800
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(filePath);

    // Retornar ruta pública
    return `/images/stations/${fileName}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
}

/**
 * Crea una nueva estación
 */
export async function createStation(
  stationData: Omit<Station, 'id'>,
  imageFile?: File
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const stations = await getAllStationsIncludingInactive();
    
    // Guardar imagen si existe (convertir a WebP)
    let coverImagePath = stationData.coverImage;
    if (imageFile) {
      coverImagePath = await saveImage(imageFile);
    }
    // Si no hay archivo pero hay URL (Firebase), mantener la URL

    const newStation: Station = {
      ...stationData,
      id: `station-${Date.now()}`,
      coverImage: coverImagePath,
      isActive: true,
    };

    stations.push(newStation);
    await saveStations(stations);
    
    // 🔥 Revalidar las páginas afectadas (On-Demand Revalidation)
    revalidatePath('/'); // Página principal
    revalidatePath('/admin'); // Panel admin
    revalidatePath(`/estacion/${newStation.id}`); // Página de la nueva estación
    
    return { success: true, id: newStation.id };
  } catch (error) {
    console.error('Error creating station:', error);
    return { success: false, error: 'Failed to create station' };
  }
}

/**
 * Actualiza una estación existente
 */
export async function updateStation(
  id: string,
  stationData: Partial<Station>,
  imageFile?: File
): Promise<{ success: boolean; error?: string }> {
  try {
    const stations = await getAllStationsIncludingInactive();
    const index = stations.findIndex(station => station.id === id);

    if (index === -1) {
      return { success: false, error: `Station with id ${id} not found` };
    }

    // Guardar nueva imagen si existe (convertir a WebP)
    let coverImagePath = stationData.coverImage;
    if (imageFile) {
      coverImagePath = await saveImage(imageFile);
      
      // Eliminar imagen anterior SOLO si es local (no Firebase)
      const oldImage = stations[index].coverImage;
      if (oldImage && oldImage.startsWith('/images/stations/')) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', oldImage);
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
          // No lanzar error si falla al borrar la imagen antigua
        }
      }
    }

    stations[index] = {
      ...stations[index],
      ...stationData,
      ...(coverImagePath && { coverImage: coverImagePath }),
    };

    await saveStations(stations);
    
    // 🔥 Revalidar las páginas afectadas
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/estacion/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating station:', error);
    return { success: false, error: 'Failed to update station' };
  }
}

/**
 * Marca una estación como inactiva (soft delete)
 */
export async function deleteStation(id: string): Promise<{ success: boolean; error?: string }> {
  const result = await updateStation(id, { isActive: false });
  
  if (result.success) {
    // 🔥 Revalidar páginas después de borrar
    revalidatePath('/');
    revalidatePath('/admin');
  }
  
  return result;
}

/**
 * Limpia imágenes huérfanas que no están siendo usadas por ninguna estación
 * Solo elimina imágenes locales (no URLs de Firebase)
 */
export async function cleanUnusedImages(): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  try {
    const stations = await getAllStationsIncludingInactive();
    const usedImages = new Set(
      stations
        .map(s => s.coverImage)
        .filter(img => img?.startsWith('/images/stations/')) // Solo imágenes locales
        .map(img => path.basename(img!))
    );

    const imagesDir = path.join(process.cwd(), 'public', 'images', 'stations');
    
    // Verificar si el directorio existe
    try {
      await fs.access(imagesDir);
    } catch {
      return { success: true, deletedCount: 0 };
    }

    const files = await fs.readdir(imagesDir);
    
    let deletedCount = 0;
    for (const file of files) {
      // Ignorar archivos ocultos y .gitkeep
      if (file.startsWith('.')) continue;
      
      if (!usedImages.has(file)) {
        await fs.unlink(path.join(imagesDir, file));
        deletedCount++;
      }
    }

    return { success: true, deletedCount };
  } catch (error) {
    console.error('Error cleaning unused images:', error);
    return { success: false, deletedCount: 0, error: 'Failed to clean images' };
  }
}