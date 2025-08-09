<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\CarRental;
use App\Models\LiveInMoroccoService;
use App\Models\FullPackage;
use App\Models\VisaService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = Booking::where('user_id', auth()->id())->with('serviceable', 'payment')->get();
        return response()->json($bookings);
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
            'serviceable_id' => 'required|integer',
            'serviceable_type' => 'required|string|in:App\Models\CarRental,App\Models\LiveInMoroccoService,App\Models\FullPackage,App\Models\VisaService',
            'status' => 'in:pending,confirmed,rejected',
            'paid' => 'boolean',
        ]);

        // Check if the service exists
        $serviceClass = $validated['serviceable_type'];
        $service = $serviceClass::find($validated['serviceable_id']);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        // Check if user already has an active booking for this service
        $existingBooking = Booking::where('user_id', auth()->id())
            ->where('serviceable_id', $validated['serviceable_id'])
            ->where('serviceable_type', $validated['serviceable_type'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if ($existingBooking) {
            return response()->json(['message' => 'You already have an active booking for this service'], 400);
        }



        $validated['user_id'] = $request->user()->id;
        $booking = Booking::create($validated);



        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking->load('serviceable')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        //
    }
}
