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
            'address' => 'required|string',
            'price' => 'required|numeric',
            'rooms' => 'required|integer',
            'available' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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
            'address' => $validated['address'],
            'price' => $validated['price'],
            'rooms' => $validated['rooms'],
            'available' => $validated['available'] ?? true,
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
            'address' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'rooms' => 'sometimes|integer',
            'available' => 'sometimes|boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_images' => 'sometimes|array',
        ]);

        $updateData = [];

        // Handle basic fields
        if (isset($validated['address'])) $updateData['address'] = $validated['address'];
        if (isset($validated['price'])) $updateData['price'] = $validated['price'];
        if (isset($validated['rooms'])) $updateData['rooms'] = $validated['rooms'];
        if (isset($validated['available'])) $updateData['available'] = $validated['available'];

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
