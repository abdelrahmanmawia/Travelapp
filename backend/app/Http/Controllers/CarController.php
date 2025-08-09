<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    // List all available cars (for users)
    public function index()
    {
        $cars = Car::where('available', true)->get();
        return response()->json($cars);
    }

    // Show a single car
    public function show($id)
    {
        $car = Car::findOrFail($id);
        return response()->json($car);
    }

    // Admin: Create a new car
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'brand' => 'required|string',
            'price' => 'required|numeric',
            'available' => 'boolean',
            'images' => 'nullable|array',
        ]);
        $car = Car::create($validated);
        return response()->json($car, 201);
    }

    // Admin: Update a car
    public function update(Request $request, $id)
    {
        $car = Car::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'brand' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'available' => 'sometimes|boolean',
            'images' => 'nullable|array',
        ]);
        $car->update($validated);
        return response()->json($car);
    }

    // Admin: Delete a car
    public function destroy($id)
    {
        $car = Car::findOrFail($id);
        $car->delete();
        return response()->json(['message' => 'Car deleted successfully']);
    }

    // Admin: Upload car image
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:4096',
        ]);
        $path = $request->file('image')->store('uploads/cars', 'public');
        $url = Storage::url($path);
        return response()->json(['url' => $url]);
    }
}
