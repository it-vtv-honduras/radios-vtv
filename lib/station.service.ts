
import {
  collection,
  getDocs,
  setDoc,
  getDoc,
  doc,
  updateDoc
} from "firebase/firestore"
import { ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage"
import {db, storage} from "./firebase"
import type { Station } from "./types"

const COLLECTION_NAME = "estaciones"

async function uploadCoverImage(file: File, stationId: string): Promise<string> {
  const webpBlob = await convertToWebP(file)
  const fileRef = storageRef(storage, `coverImages/${stationId}.webp`)
  await uploadBytes(fileRef, webpBlob)
  return await getDownloadURL(fileRef)
}

async function deleteCoverImage(stationId: string): Promise<void> {
  const fileRef = storageRef(storage, `coverImages/${stationId}.webp`)
  try {
    await deleteObject(fileRef)
  } catch (error) {
    console.warn("No se pudo eliminar la imagen anterior (puede que no exista):", error)
  }
}

async function convertToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject("No se pudo crear el contexto del canvas")
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        if (blob) resolve(blob)
        else reject("Error al convertir a WebP")
      }, "image/webp")
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export async function getAllStations(): Promise<Station[]> {
  const colRef = collection(db, COLLECTION_NAME)
  const snapshot = await getDocs(colRef)

  return snapshot.docs.map(doc => ({
    ...(doc.data() as Station),
    id: doc.id,
  }))
}



export async function getStationById(id: string): Promise<Station | null> {
  const docRef = doc(db, COLLECTION_NAME, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Station
}

export async function createStation(
  station: Omit<Station, "id" | "isActive">,
  coverImageFile?: File
): Promise<string> {
  const newId = `station-${Date.now()}`
  let coverImageUrl = station.coverImage || ""

  if (coverImageFile) {
    coverImageUrl = await uploadCoverImage(coverImageFile, newId)
  }

  const newStation: Station = {
    ...station,
    id: newId,
    coverImage: coverImageUrl,
    isActive: true,
  }

  await setDoc(doc(db, COLLECTION_NAME, newId), newStation)
  return newId
}

export async function updateStation(
  id: string,
  stationData: Partial<Station>,
  newCoverImageFile?: File
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id)

  if (newCoverImageFile) {
    await deleteCoverImage(id) 
    const newUrl = await uploadCoverImage(newCoverImageFile, id)
    stationData.coverImage = newUrl
  }

  await updateDoc(docRef, {
    ...stationData,
    updatedAt: new Date()
  })
}

export async function deleteStation(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, {
    isActive: false,
    updatedAt: new Date()
  })
}