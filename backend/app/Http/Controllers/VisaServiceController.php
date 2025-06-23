<?php

namespace App\Http\Controllers;

use App\Models\VisaService;
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
            'validity' => 'required|string',
        ]);
        $validated['user_id'] = $request->user()->id;
        $service = VisaService::create($validated);
        return response()->json($service, 201);
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
}
