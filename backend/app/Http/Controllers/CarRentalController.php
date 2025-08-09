<?php

namespace App\Http\Controllers;

use App\Models\CarRental;
use App\Models\Booking;
use Illuminate\Http\Request;

class CarRentalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $carRentals = CarRental::where('user_id', auth()->id())
            ->with('car')
            ->get();
        return response()->json($carRentals);
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
            'car_id' => 'required|exists:cars,id',
            'license_age' => 'required|integer|min:18',
            'license_photo' => 'required|string',
        ]);

        // Check if user already has an active car rental
        $existingRental = CarRental::where('user_id', auth()->id())
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if ($existingRental) {
            return response()->json(['message' => 'You already have an active car rental'], 400);
        }

        // Create the car rental service
        $carRental = CarRental::create([
            'user_id' => auth()->id(),
            'car_id' => $validated['car_id'],
            'license_age' => $validated['license_age'],
            'license_photo' => $validated['license_photo'],
            'status' => 'pending',
        ]);

        // Create the booking for this service
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'serviceable_id' => $carRental->id,
            'serviceable_type' => CarRental::class,
            'status' => 'pending',
            'paid' => false,
        ]);

        return response()->json([
            'message' => 'Car rental service booked successfully',
            'carRental' => $carRental->load('car'),
            'booking' => $booking
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CarRental $carRental)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CarRental $carRental)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CarRental $carRental)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CarRental $carRental)
    {
        //
    }

    // Cancel car rental service
    public function cancel(Request $request, $id)
    {
        $carRental = CarRental::where('user_id', auth()->id())
            ->where('id', $id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if (!$carRental) {
            return response()->json(['message' => 'No active car rental found'], 404);
        }

        // Update car rental status
        $carRental->update(['status' => 'cancelled']);

        // Update booking status
        $booking = $carRental->booking;
        if ($booking) {
            $booking->update(['status' => 'rejected']);
        }

        return response()->json([
            'message' => 'Car rental service cancelled successfully',
            'carRental' => $carRental->load('car')
        ]);
    }
}
