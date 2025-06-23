<?php

namespace App\Http\Controllers;

use App\Models\FullPackage;
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
            'includes' => 'required|array',
            'total_price' => 'required|numeric',
        ]);
        $validated['user_id'] = $request->user()->id;
        $package = FullPackage::create($validated);
        return response()->json($package, 201);
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
}
