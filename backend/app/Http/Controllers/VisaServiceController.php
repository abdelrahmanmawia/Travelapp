<?php

namespace App\Http\Controllers;

use App\Models\VisaService;
use App\Models\Booking;
use Illuminate\Http\Request;

class VisaServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = VisaService::where('user_id', auth()->id())->get();
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
            'country_of_birth' => 'required|string',
            'date_of_birth' => 'required|date',
            'residence_country' => 'required|string',
            'validity' => 'required|integer',
        ]);

        // Check if user already has an active visa service
        $existingService = VisaService::where('user_id', auth()->id())
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if ($existingService) {
            return response()->json(['message' => 'You already have an active visa service'], 400);
        }

        // Create the visa service
        $service = VisaService::create([
            'user_id' => auth()->id(),
            'country_of_birth' => $validated['country_of_birth'],
            'date_of_birth' => $validated['date_of_birth'],
            'residence_country' => $validated['residence_country'],
            'validity' => $validated['validity'],
            'status' => 'pending',
        ]);

        // Create the booking for this service
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'serviceable_id' => $service->id,
            'serviceable_type' => VisaService::class,
            'status' => 'pending',
            'paid' => false,
        ]);

        return response()->json([
            'message' => 'Visa service booked successfully',
            'service' => $service,
            'booking' => $booking
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(VisaService $visaService)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VisaService $visaService)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VisaService $visaService)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VisaService $visaService)
    {
        //
    }

    // Cancel visa service
    public function cancel(Request $request, $id)
    {
        $service = VisaService::where('user_id', auth()->id())
            ->where('id', $id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if (!$service) {
            return response()->json(['message' => 'No active visa service found'], 404);
        }

        // Update service status
        $service->update(['status' => 'cancelled']);

        // Update booking status
        $booking = $service->booking;
        if ($booking) {
            $booking->update(['status' => 'rejected']);
        }

        return response()->json([
            'message' => 'Visa service cancelled successfully',
            'service' => $service
        ]);
    }
}
