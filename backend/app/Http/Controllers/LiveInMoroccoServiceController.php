<?php

namespace App\Http\Controllers;

use App\Models\LiveInMoroccoService;
use Illuminate\Http\Request;

class LiveInMoroccoServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Return all LiveInMoroccoService records for the authenticated user
        $services = LiveInMoroccoService::where('user_id', auth()->id())->get();
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
            'housing' => 'required|boolean',
            'sim_card' => 'required|boolean',
            'admin_support' => 'required|boolean',
            'price' => 'required|numeric',
            'media' => 'nullable|array',
        ]);
        $validated['user_id'] = $request->user()->id;
        $service = LiveInMoroccoService::create($validated);
        return response()->json($service, 201);
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
}
