<?php

namespace App\Http\Controllers;

use App\Models\Appartement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AppartementController extends Controller
{
    public function index()
    {
        $appartements = Appartement::with('images')->latest()->get();
        return response()->json($appartements);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'rooms' => 'required|integer',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $appartement = Appartement::create($request->only(['title', 'address', 'rooms', 'price', 'description']));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('appartements', 'public');
                $appartement->images()->create([
                    'path' => $path,
                    'order' => $index
                ]);
            }
        }

        return response()->json($appartement->load('images'), 201);
    }

    public function show(Appartement $appartement)
    {
        return response()->json($appartement->load('images'));
    }

    public function update(Request $request, Appartement $appartement)
    {
        $request->validate([
            'title' => 'string|max:255',
            'address' => 'string|max:255',
            'rooms' => 'integer',
            'price' => 'numeric',
            'description' => 'nullable|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $appartement->update($request->only(['title', 'address', 'rooms', 'price', 'description']));

        if ($request->hasFile('images')) {
            foreach ($appartement->images as $image) {
                Storage::disk('public')->delete($image->path);
                $image->delete();
            }

            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('appartements', 'public');
                $appartement->images()->create([
                    'path' => $path,
                    'order' => $index
                ]);
            }
        }

        return response()->json($appartement->load('images'));
    }

    public function destroy(Appartement $appartement)
    {
        foreach ($appartement->images as $image) {
            Storage::disk('public')->delete($image->path);

            $image->delete();
        }

        $appartement->delete();
        return response()->json(['message' => 'Appartement deleted successfully']);
    }
}
