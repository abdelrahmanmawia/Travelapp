import { useState, useEffect } from 'react';
import { Car, Calendar, DollarSign, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import api from '@/lib/api';

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCarImages, setSelectedCarImages] = useState({});
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await api.get('/admin/cars');
      const data = response.data.data || response.data;
      setCars(data);

      const imageIndexes = {};
      data.forEach(car => {
        imageIndexes[car.id] = 0;
      });
      setSelectedCarImages(imageIndexes);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/cars/${id}`);
      setCars(prev => prev.filter(car => car.id !== id));
    } catch (error) {
      alert('Failed to delete car.');
    } finally {
      setDeletingId(null);
    }
  };

  const nextImage = (carId, totalImages) => {
    setSelectedCarImages(prev => ({
      ...prev,
      [carId]: (prev[carId] + 1) % totalImages
    }));
  };

  const prevImage = (carId, totalImages) => {
    setSelectedCarImages(prev => ({
      ...prev,
      [carId]: prev[carId] === 0 ? totalImages - 1 : prev[carId] - 1
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-indigo-600">Loading cars...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Car className="w-10 h-10 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-800">Available Cars</h1>
        </div>

        {cars.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Car className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No cars available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow relative">
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(car.id)}
                  disabled={deletingId === car.id}
                  className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition z-10"
                  title="Delete Car"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {/* Image Carousel */}
                {car.images && car.images.length > 0 ? (
                  <div className="relative h-64 bg-gray-200">
                    <img
                      src={car.images[selectedCarImages[car.id]]?.url}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />

                    {car.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(car.id, car.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => nextImage(car.id, car.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                          {car.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === selectedCarImages[car.id]
                                  ? 'bg-white w-6'
                                  : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Car className="w-20 h-20 text-gray-400" />
                  </div>
                )}

                {/* Car Details */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {car.brand} {car.model}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{car.year}</span>
                    </div>

                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-lg">{parseFloat(car.price).toLocaleString()}</span>
                    </div>
                  </div>

                  {car.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {car.description}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {car.images?.length || 0} photo{car.images?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}