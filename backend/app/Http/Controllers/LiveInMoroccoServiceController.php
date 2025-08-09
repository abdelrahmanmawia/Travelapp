<?php

namespace App\Http\Controllers;

use App\Models\LiveInMoroccoService;
use App\Models\Appartement;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LiveInMoroccoServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Return all LiveInMoroccoService records for the authenticated user
        $services = LiveInMoroccoService::where('user_id', auth()->id())
            ->with('appartement')
            ->get();
        return response()->json($services);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'appartement_id' => 'required|exists:appartements,id',
        ]);

        // Check if appartement is available
        $appartement = Appartement::findOrFail($validated['appartement_id']);
        if (!$appartement->available) {
            return response()->json(['message' => 'This appartement is not available'], 400);
        }

        // Check if user already has an active Live in Morocco service
        $existingService = LiveInMoroccoService::where('user_id', auth()->id())
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if ($existingService) {
            return response()->json(['message' => 'You already have an active Live in Morocco service'], 400);
        }

        // Create the Live in Morocco service
        $service = LiveInMoroccoService::create([
            'user_id' => auth()->id(),
            'appartement_id' => $validated['appartement_id'],
            'status' => 'pending',
        ]);

        // Create the booking for this service
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'serviceable_id' => $service->id,
            'serviceable_type' => LiveInMoroccoService::class,
            'status' => 'pending',
            'paid' => false,
        ]);

        // Mark appartement as unavailable
        $appartement->update(['available' => false]);

        return response()->json([
            'message' => 'Live in Morocco service booked successfully',
            'service' => $service->load('appartement'),
            'booking' => $booking
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(LiveInMoroccoService $liveInMoroccoService)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LiveInMoroccoService $liveInMoroccoService)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LiveInMoroccoService $liveInMoroccoService)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LiveInMoroccoService $liveInMoroccoService)
    {
        //
    }

    // Cancel Live in Morocco service
    public function cancel(Request $request, $id)
    {
        $service = LiveInMoroccoService::where('user_id', auth()->id())
            ->where('id', $id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if (!$service) {
            return response()->json(['message' => 'No active Live in Morocco service found'], 404);
        }

        // Update service status
        $service->update(['status' => 'cancelled']);

        // Update booking status
        $booking = $service->booking;
        if ($booking) {
            $booking->update(['status' => 'rejected']);
        }

        // Mark appartement as available again
        $appartement = $service->appartement;
        if ($appartement) {
            $appartement->update(['available' => true]);
        }

        return response()->json([
            'message' => 'Live in Morocco service cancelled successfully',
            'service' => $service->load('appartement')
        ]);
    }

    // Admin: Upload live in Morocco image
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:4096',
        ]);
        $path = $request->file('image')->store('uploads/live', 'public');
        $url = Storage::url($path);
        return response()->json(['url' => $url]);
    }
}
