'use server';

import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { Station } from './types';

const STATIONS_FILE_PATH = path.join(process.cwd(), 'data', 'stations.json');
const BLOB_STATIONS_KEY = 'stations.json';

// ========================================
// FUNCIONES PÚBLICAS (LECTURA DESDE JSON LOCAL)
// ⚡ Ultra rápido - SSG - SEO perfecto
// ========================================

/**
 * Lee todas las estaciones activas desde JSON ESTÁTICO
 * Usado por páginas públicas para máxima velocidad y SEO
 */
export async function getAllStations(): Promise<Station[]> {
  try {
    const fileContent = await fs.readFile(STATIONS_FILE_PATH, 'utf-8');
    const stations: Station[] = JSON.parse(fileContent);
    return stations.filter(station => station.isActive !== false);
  } catch (error) {
    console.error('Error reading stations file:', error);
    return [];
  }
}

export async function getStationById(id: string): Promise<Station | null> {
  const stations = await getAllStations();
  return stations.find(station => station.id === id) || null;
}

export async function getAllStationIds(): Promise<string[]> {
  const stations = await getAllStations();
  return stations.map(station => station.id);
}

// ========================================
// FUNCIONES ADMINISTRATIVAS (ESCRITURA EN VERCEL BLOB)
// 💾 Persistente - Solo para admin panel
// ========================================

/**
 * Lee todas las estaciones desde VERCEL BLOB (incluyendo inactivas)
 */
export async function getAllStationsIncludingInactive(): Promise<Station[]> {
  try {
    // Intentar leer desde Blob primero
    const blobUrl = `https://${process.env.BLOB_READ_WRITE_TOKEN?.split('_')[0]}.public.blob.vercel-storage.com/${BLOB_STATIONS_KEY}`;
    const response = await fetch(blobUrl);
    
    if (response.ok) {
      const stations = await response.json();
      return stations;
    }
    
    // Fallback: leer desde JSON local si Blob está vacío
    const fileContent = await fs.readFile(STATIONS_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading stations from Blob:', error);
    // Fallback a JSON local
    try {
      const fileContent = await fs.readFile(STATIONS_FILE_PATH, 'utf-8');
      return JSON.parse(fileContent);
    } catch {
      return [];
    }
  }
}

/**
 * Guarda el array completo de estaciones en Blob
 */
async function saveStationsToBlob(stations: Station[]): Promise<void> {
  const blob = await put(BLOB_STATIONS_KEY, JSON.stringify(stations, null, 2), {
    access: 'public',
    contentType: 'application/json',
  });
  
  console.log(`✅ Stations saved to Blob: ${blob.url}`);
}

/**
 * Sube imagen a Blob y retorna URL pública
 * Reemplaza la imagen anterior si existe
 */
async function uploadImageToBlob(file: File, stationId: string): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convertir a WebP
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85 })
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    const fileName = `stations/${stationId}.webp`;
    
    // Subir a Blob (reemplaza automáticamente si existe)
    const blob = await put(fileName, webpBuffer, {
      access: 'public',
      contentType: 'image/webp',
    });

    console.log(`✅ Image uploaded to Blob: ${blob.url}`);
    return blob.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
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
    
    const newStation: Station = {
      ...stationData,
      id: `station-${Date.now()}`,
      isActive: true,
    };

    // Subir imagen a Blob si existe
    if (imageFile) {
      newStation.coverImage = await uploadImageToBlob(imageFile, newStation.id);
    }

    stations.push(newStation);
    await saveStationsToBlob(stations);
    
    // Revalidar páginas
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/estacion/${newStation.id}`);
    
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

    // Subir nueva imagen a Blob si existe (reemplaza la anterior)
    if (imageFile) {
      stationData.coverImage = await uploadImageToBlob(imageFile, id);
    }

    stations[index] = {
      ...stations[index],
      ...stationData,
    };

    await saveStationsToBlob(stations);
    
    // Revalidar páginas
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
    revalidatePath('/');
    revalidatePath('/admin');
  }
  
  return result;
}

// ========================================
// UTILIDADES DE SINCRONIZACIÓN
// ========================================

/**
 * Importa datos desde JSON local a Blob
 * Ejecutar una sola vez para migrar datos existentes
 */
export async function importFromJSON(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const fileContent = await fs.readFile(STATIONS_FILE_PATH, 'utf-8');
    const stations: Station[] = JSON.parse(fileContent);
    
    await saveStationsToBlob(stations);
    
    console.log(`✅ Imported ${stations.length} stations to Blob`);
    return { success: true, count: stations.length };
  } catch (error) {
    console.error('Error importing to Blob:', error);
    return { success: false, count: 0, error: 'Failed to import' };
  }
}