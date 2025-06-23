<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    VisaServiceController,
    CarRentalController,
    LiveInMoroccoServiceController,
    FullPackageController,
    BookingController,
    PaymentController
};

// Public Routes
Route::middleware('guest')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    // Visa
    Route::get('/visa-services', [VisaServiceController::class, 'index']);
    Route::post('/visa-services', [VisaServiceController::class, 'store']);

    // Car Rental
    Route::get('/car-rentals', [CarRentalController::class, 'index']);
    Route::post('/car-rentals', [CarRentalController::class, 'store']);

    // Live In Morocco
    Route::get('/live-services', [LiveInMoroccoServiceController::class, 'index']);
    Route::post('/live-services', [LiveInMoroccoServiceController::class, 'store']);

    // Full Package
    Route::get('/full-packages', [FullPackageController::class, 'index']);
    Route::post('/full-packages', [FullPackageController::class, 'store']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});


