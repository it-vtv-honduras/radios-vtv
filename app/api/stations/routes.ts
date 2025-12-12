import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllStations, 
  createStation, 
  updateStation, 
  deleteStation 
} from '@/lib/station.service';
import type { Station } from '@/lib/types';

// GET - Obtener todas las estaciones
export async function GET() {
  try {
    const stations = await getAllStations();
    return NextResponse.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      { error: 'Error al obtener estaciones' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva estación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validación básica
    if (!body.name || !body.genre || !body.streamUrl) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: name, genre, streamUrl' },
        { status: 400 }
      );
    }

    const newStationId = await createStation(body);
    
    return NextResponse.json(
      { message: 'Estación creada exitosamente', id: newStationId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating station:', error);
    return NextResponse.json(
      { error: 'Error al crear estación' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estación existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...stationData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el ID de la estación' },
        { status: 400 }
      );
    }

    await updateStation(id, stationData);
    
    return NextResponse.json({ message: 'Estación actualizada exitosamente' });
  } catch (error) {
    console.error('Error updating station:', error);
    return NextResponse.json(
      { error: 'Error al actualizar estación' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar (desactivar) estación
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el ID de la estación' },
        { status: 400 }
      );
    }

    await deleteStation(id);
    
    return NextResponse.json({ message: 'Estación eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting station:', error);
    return NextResponse.json(
      { error: 'Error al eliminar estación' },
      { status: 500 }
    );
  }
}