'use client';

import { useState } from 'react';
import { importFromJSON } from '@/lib/stations.actions';

export default function ImportPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleImport = async () => {
    setLoading(true);
    setStatus('Importando datos a Blob...');
    
    const result = await importFromJSON();
    
    setStatus(result.success 
      ? `✅ ${result.count} estaciones importadas correctamente` 
      : `❌ Error: ${result.error}`
    );
    setLoading(false);
  };
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Importar datos a Vercel Blob</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Este paso solo se hace UNA VEZ para migrar 
          tus datos existentes de data/stations.json a Vercel Blob.
        </p>
      </div>

      <button 
        onClick={handleImport}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Importando...' : 'Importar desde JSON local'}
      </button>
      
      {status && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm">{status}</p>
        </div>
      )}
    </main>
  );
}