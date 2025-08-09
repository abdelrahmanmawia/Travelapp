<?php

namespace App\Http\Controllers;

use App\Models\FullPackage;
use App\Models\Booking;
use Illuminate\Http\Request;

class FullPackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packages = FullPackage::where('user_id', auth()->id())->get();
        return response()->json($packages);
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
            'visa' => 'required|boolean',
            'air_ticket' => 'required|boolean',
            'transport' => 'required|boolean',
            'program' => 'required|boolean',
            'airport_pickup' => 'required|boolean',
        ]);

        // Check if user already has an active full package
        $existingPackage = FullPackage::where('user_id', auth()->id())
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if ($existingPackage) {
            return response()->json(['message' => 'You already have an active full package'], 400);
        }

        // Create the full package service
        $package = FullPackage::create([
            'user_id' => auth()->id(),
            'visa' => $validated['visa'],
            'air_ticket' => $validated['air_ticket'],
            'transport' => $validated['transport'],
            'program' => $validated['program'],
            'airport_pickup' => $validated['airport_pickup'],
            'status' => 'pending',
        ]);

        // Create the booking for this service
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'serviceable_id' => $package->id,
            'serviceable_type' => FullPackage::class,
            'status' => 'pending',
            'paid' => false,
        ]);

        return response()->json([
            'message' => 'Full package service booked successfully',
            'package' => $package,
            'booking' => $booking
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(FullPackage $fullPackage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FullPackage $fullPackage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FullPackage $fullPackage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FullPackage $fullPackage)
    {
        //
    }

    // Cancel full package service
    public function cancel(Request $request, $id)
    {
        $package = FullPackage::where('user_id', auth()->id())
            ->where('id', $id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if (!$package) {
            return response()->json(['message' => 'No active full package found'], 404);
        }

        // Update package status
        $package->update(['status' => 'cancelled']);

        // Update booking status
        $booking = $package->booking;
        if ($booking) {
            $booking->update(['status' => 'rejected']);
        }

        return response()->json([
            'message' => 'Full package service cancelled successfully',
            'package' => $package
        ]);
    }
}
