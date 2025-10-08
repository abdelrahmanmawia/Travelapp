<?php

namespace App\Http\Controllers;

use App\Models\Appartement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AppartementController extends Controller
{
    // List all available appartements (for users)
    public function index()
    {
        $appartements = Appartement::where('available', true)->get();
        return response()->json($appartements);
    }

    // Show a single appartement
    public function show($id)
    {
        $appartement = Appartement::findOrFail($id);
        return response()->json($appartement);
    }

    // Admin: Create a new appartement
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'price_per_night' => 'required|numeric',
            'bedrooms' => 'required|integer',
            'bathrooms' => 'required|numeric',
            'max_guests' => 'required|integer',
            'amenities' => 'nullable|array',
            'available' => 'nullable|boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $imagePaths = [];

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('appartements', 'public');
                $imagePaths[] = $path;
            }
        }

        $appartementData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'price_per_night' => $validated['price_per_night'],
            'bedrooms' => $validated['bedrooms'],
            'bathrooms' => $validated['bathrooms'],
            'max_guests' => $validated['max_guests'],
            'amenities' => $validated['amenities'] ?? [],
            'available' => $request->has('available') ? (bool) $request->input('available') : true,
            'images' => $imagePaths,
        ];

        $appartement = Appartement::create($appartementData);
        return response()->json($appartement, 201);
    }

    // Admin: Update an appartement
    public function update(Request $request, $id)
    {
        $appartement = Appartement::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string',
            'price_per_night' => 'sometimes|numeric',
            'bedrooms' => 'sometimes|integer',
            'bathrooms' => 'sometimes|numeric',
            'max_guests' => 'sometimes|integer',
            'amenities' => 'sometimes|array',
            'available' => 'nullable|boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'remove_images' => 'sometimes|array',
        ]);

        $updateData = [];

        // Handle basic fields
        if (isset($validated['title'])) $updateData['title'] = $validated['title'];
        if (isset($validated['description'])) $updateData['description'] = $validated['description'];
        if (isset($validated['address'])) $updateData['address'] = $validated['address'];
        if (isset($validated['city'])) $updateData['city'] = $validated['city'];
        if (isset($validated['price_per_night'])) $updateData['price_per_night'] = $validated['price_per_night'];
        if (isset($validated['bedrooms'])) $updateData['bedrooms'] = $validated['bedrooms'];
        if (isset($validated['bathrooms'])) $updateData['bathrooms'] = $validated['bathrooms'];
        if (isset($validated['max_guests'])) $updateData['max_guests'] = $validated['max_guests'];
        if (isset($validated['amenities'])) $updateData['amenities'] = $validated['amenities'];
        if ($request->has('available')) $updateData['available'] = (bool) $request->input('available');

        // Handle image removal
        $currentImages = $appartement->images ?? [];
        if (isset($validated['remove_images'])) {
            foreach ($validated['remove_images'] as $index) {
                if (isset($currentImages[$index])) {
                    // Delete the file from storage
                    Storage::disk('public')->delete($currentImages[$index]);
                    unset($currentImages[$index]);
                }
            }
            $currentImages = array_values($currentImages); // Re-index array
        }

        // Handle new image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('appartements', 'public');
                $currentImages[] = $path;
            }
        }

        $updateData['images'] = $currentImages;

        $appartement->update($updateData);
        return response()->json($appartement);
    }

    // Admin: Delete an appartement
    public function destroy($id)
    {
        $appartement = Appartement::findOrFail($id);

        // Delete associated images from storage
        if ($appartement->images) {
            foreach ($appartement->images as $imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        $appartement->delete();
        return response()->json(['message' => 'Appartement deleted successfully']);
    }
}
