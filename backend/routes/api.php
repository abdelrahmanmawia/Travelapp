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
    AdminController,
    CarController,
    AppartementController,
    UploadController
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
    Route::post('/visa-services/{id}/cancel', [VisaServiceController::class, 'cancel']);

    // Car Rental
    Route::get('/car-rentals', [CarRentalController::class, 'index']);
    Route::post('/car-rentals', [CarRentalController::class, 'store']);
    Route::post('/car-rentals/{id}/cancel', [CarRentalController::class, 'cancel']);

    // Live In Morocco
    Route::get('/live-services', [LiveInMoroccoServiceController::class, 'index']);
    Route::post('/live-services', [LiveInMoroccoServiceController::class, 'store']);
    Route::post('/live-services/{id}/cancel', [LiveInMoroccoServiceController::class, 'cancel']);

    // Full Package
    Route::get('/full-packages', [FullPackageController::class, 'index']);
    Route::post('/full-packages', [FullPackageController::class, 'store']);
    Route::post('/full-packages/{id}/cancel', [FullPackageController::class, 'cancel']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);

    // Cars (user)
    Route::get('/cars', [CarController::class, 'index']);
    Route::get('/cars/{id}', [CarController::class, 'show']);
    // Appartements (user)
    Route::get('/appartements', [AppartementController::class, 'index']);
    Route::get('/appartements/{id}', [AppartementController::class, 'show']);

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
    Route::post('/admin/live-services/upload-image', [LiveInMoroccoServiceController::class, 'uploadImage']);

    // Full Packages Management
    Route::get('/admin/full-packages', [AdminController::class, 'fullPackages']);
    Route::patch('/admin/full-packages/{id}/status', [AdminController::class, 'updateFullPackageStatus']);
    Route::delete('/admin/full-packages/{id}', [AdminController::class, 'deleteFullPackage']);

    // Payments Management
    Route::get('/admin/payments', [AdminController::class, 'payments']);

    // Cars (admin)
    Route::get('/admin/cars', [CarController::class, 'index']);
    Route::post('/admin/cars', [CarController::class, 'store']);
    Route::put('/admin/cars/{car}', [CarController::class, 'update']);
    Route::delete('/admin/cars/{car}', [CarController::class, 'destroy']);

    // Appartements (admin)
    Route::get('/admin/appartements', [AppartementController::class, 'index']);
    Route::post('/admin/appartements', [AppartementController::class, 'store']);
    Route::put('/admin/appartements/{id}', [AppartementController::class, 'update']);
    Route::delete('/admin/appartements/{id}', [AppartementController::class, 'destroy']);
    Route::post('/admin/appartements/upload-image', [AppartementController::class, 'uploadImage']);
});


