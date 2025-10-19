<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CarController extends Controller
{
    public function index()
    {
        $cars = Car::with('images')->latest()->get();
        return response()->json($cars);
    }

    public function store(Request $request)
    {
        $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $car = Car::create($request->only(['brand', 'model', 'year', 'price', 'description']));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('cars', 'public');
                $car->images()->create([
                    'path' => $path,
                    'order' => $index
                ]);
            }
        }

        return response()->json($car->load('images'), 201);
    }

    public function show(Car $car)
    {
        return response()->json($car->load('images'));
    }

    public function update(Request $request, Car $car)
    {
        $request->validate([
            'brand' => 'string|max:255',
            'model' => 'string|max:255',
            'year' => 'integer',
            'price' => 'numeric',
            'description' => 'nullable|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $car->update($request->only(['brand', 'model', 'year', 'price', 'description']));

        if ($request->hasFile('images')) {
            // Delete old images
            foreach ($car->images as $image) {
                Storage::disk('public')->delete($image->path);
                $image->delete();
            }

            // Upload new images
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('cars', 'public');
                $car->images()->create([
                    'path' => $path,
                    'order' => $index
                ]);
            }
        }

        return response()->json($car->load('images'));
    }

    public function destroy(Car $car)
    {
        foreach ($car->images as $image) {
            if (Storage::disk('public')->exists($image->path)) {
                Log::info("File exists at path: {$image->path}");
                $deleted = Storage::disk('public')->delete($image->path);
                Log::info("Deleting {$image->path}: " . ($deleted ? 'success' : 'fail'));
            } else {
                Log::warning("File not found at path: {$image->path}");
            }
            $image->delete();
        }

        $car->delete();

        return response()->json(['message' => 'Car deleted successfully']);
    }
}
