import React from 'react';

interface PopupFormProps {
  onClose: (formData: any) => void;
}

const PopupForm: React.FC<PopupFormProps> = ({ onClose }) => {
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
  
      const formData = new FormData(form);
  
      const formDataObject: any = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });

       // Generar un timestamp a partir de la fecha y hora
        const fecha = formDataObject.fecha; // Aquí asumo que "fecha" es el nombre del campo en tu formulario
        const hora = formDataObject.hora; // Aquí asumo que "hora" es el nombre del campo en tu formulario
        const timestamp = new Date(`${fecha} ${hora}`).getTime()/1000; // Generar timestamp
    
      alert( typeof(timestamp)+' fdjsf ' + timestamp);
      onClose(timestamp);
    };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2">Indica la fecha y hora de tu ruta</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              className="mt-1 p-1 border w-full"
              name='fecha'
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Hora</label>
            <input
              type="time"
              className="mt-1 p-1 border w-full"
              name='hora'
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Crear Ruta
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
