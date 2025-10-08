<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    // Helper function to format images
    private function formatCar(Car $car)
    {
        $car->images = $car->images 
            ? array_map(fn($path) => asset(Storage::url($path))
, $car->images) 
            : [];
        return $car;
    }

    // List available cars
    public function index()
    {
        $cars = Car::where('available', true)->get()->map(fn($car) => $this->formatCar($car));
        return response()->json($cars);
    }

    // Show single car
    public function show(Car $car)
    {
        return response()->json($this->formatCar($car));
    }

    // Store new car
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer',
            'price_per_day' => 'required|numeric',
            'location' => 'required|string',
            'seats' => 'required|integer',
            'transmission' => 'required|string',
            'fuel_type' => 'required|string',
            'available' => 'boolean',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('cars', 'public');
            }
        }

        $car = Car::create(array_merge($validated, ['images' => $imagePaths]));
        return response()->json($this->formatCar($car), 201);
    }

    // Update car
    public function update(Request $request, Car $car)
    {
        $validated = $request->validate([
            'brand' => 'string',
            'model' => 'string',
            'year' => 'integer',
            'price_per_day' => 'numeric',
            'location' => 'string',
            'seats' => 'integer',
            'transmission' => 'string',
            'fuel_type' => 'string',
            'available' => 'boolean',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $imagePaths = $car->images ?? [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('cars', 'public');
            }
        }

        $car->update(array_merge($validated, ['images' => $imagePaths]));
        return response()->json($this->formatCar($car));
    }

    // Delete car
    public function destroy(Car $car)
    {
        $car->delete();
        return response()->json(['message' => 'Car deleted successfully']);
    }
}
