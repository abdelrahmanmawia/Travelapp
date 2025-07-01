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
    PaymentController,
    AdminController
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

// Admin Routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    
    // Users Management
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
    
    // Bookings Management
    Route::get('/admin/bookings', [AdminController::class, 'bookings']);
    Route::patch('/admin/bookings/{id}/status', [AdminController::class, 'updateBookingStatus']);
    Route::delete('/admin/bookings/{id}', [AdminController::class, 'deleteBooking']);
    
    // Visa Services Management
    Route::get('/admin/visa-services', [AdminController::class, 'visaServices']);
    Route::patch('/admin/visa-services/{id}/status', [AdminController::class, 'updateVisaServiceStatus']);
    Route::delete('/admin/visa-services/{id}', [AdminController::class, 'deleteVisaService']);
    
    // Car Rentals Management
    Route::get('/admin/car-rentals', [AdminController::class, 'carRentals']);
    Route::patch('/admin/car-rentals/{id}/status', [AdminController::class, 'updateCarRentalStatus']);
    Route::delete('/admin/car-rentals/{id}', [AdminController::class, 'deleteCarRental']);
    
    // Live Services Management
    Route::get('/admin/live-services', [AdminController::class, 'liveServices']);
    Route::patch('/admin/live-services/{id}/status', [AdminController::class, 'updateLiveServiceStatus']);
    Route::delete('/admin/live-services/{id}', [AdminController::class, 'deleteLiveService']);
    
    // Full Packages Management
    Route::get('/admin/full-packages', [AdminController::class, 'fullPackages']);
    Route::patch('/admin/full-packages/{id}/status', [AdminController::class, 'updateFullPackageStatus']);
    Route::delete('/admin/full-packages/{id}', [AdminController::class, 'deleteFullPackage']);
    
    // Payments Management
    Route::get('/admin/payments', [AdminController::class, 'payments']);
});


