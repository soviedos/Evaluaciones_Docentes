export default function CargaPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cargar PDFs</h2>
      <p className="text-gray-600">
        Sube archivos PDF de evaluaciones docentes para su análisis.
      </p>
      <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <p className="text-gray-400">
          Arrastra archivos PDF aquí o haz clic para seleccionar
        </p>
      </div>
    </div>
  );
}
