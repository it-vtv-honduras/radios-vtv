/**
 * Script para migrar datos de Firebase a JSON estático
 * 
 * Instrucciones de uso:
 * 1. Instala las dependencias: npm install firebase
 * 2. Configura tus credenciales de Firebase en este script
 * 3. Ejecuta: node scripts/migrate-firebase-to-json.js
 * 4. Los datos se guardarán en data/stations.json
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs').promises;
const path = require('path');

// ⚠️ CONFIGURA TUS CREDENCIALES DE FIREBASE AQUÍ
const firebaseConfig = {
  apiKey: "AIzaSyCl3cdRikWxnx0M6XHTEnZtLkzVXC2MEiU",
  authDomain: "radios-vtv.firebaseapp.com",
  projectId: "radios-vtv",
  storageBucket: "radios-vtv.firebasestorage.app",
  messagingSenderId: "1016199599708",
  appId: "1:1016199599708:web:498ac8d61d817c8bdf7899"
};

async function migrateFirebaseToJson() {
  try {
    console.log('🚀 Iniciando migración de Firebase a JSON...');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Obtener todas las estaciones
    console.log('📡 Obteniendo estaciones de Firebase...');
    const colRef = collection(db, 'estaciones');
    const snapshot = await getDocs(colRef);

    const stations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Se obtuvieron ${stations.length} estaciones`);

    // Crear directorio data si no existe
    const dataDir = path.join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
      console.log('📁 Directorio data/ creado');
    }

    // Guardar en JSON
    const filePath = path.join(dataDir, 'stations.json');
    await fs.writeFile(filePath, JSON.stringify(stations, null, 2), 'utf-8');

    console.log(`💾 Datos guardados en ${filePath}`);
    console.log('✨ Migración completada exitosamente!');

    // Mostrar resumen
    console.log('\n📊 Resumen:');
    console.log(`   - Total de estaciones: ${stations.length}`);
    console.log(`   - Estaciones activas: ${stations.filter(s => s.isActive !== false).length}`);
    console.log(`   - Estaciones inactivas: ${stations.filter(s => s.isActive === false).length}`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar la migración
migrateFirebaseToJson();