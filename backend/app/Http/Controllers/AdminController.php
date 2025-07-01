<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Booking;
use App\Models\VisaService;
use App\Models\CarRental;
use App\Models\LiveInMoroccoService;
use App\Models\FullPackage;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Get counts for dashboard
        $totalUsers = User::count();
        $totalBookings = Booking::count();
        $totalVisaServices = VisaService::count();
        $totalCarRentals = CarRental::count();
        $totalLiveServices = LiveInMoroccoService::count();
        $totalFullPackages = FullPackage::count();
        $totalPayments = Payment::count();

        // Get recent activities
        $recentBookings = Booking::with('user')->latest()->take(5)->get();
        $recentVisaServices = VisaService::with('user')->latest()->take(5)->get();
        $recentPayments = Payment::with('user')->latest()->take(5)->get();

        // Get monthly statistics
        $monthlyStats = Booking::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->get();

        return response()->json([
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalBookings' => $totalBookings,
                'totalVisaServices' => $totalVisaServices,
                'totalCarRentals' => $totalCarRentals,
                'totalLiveServices' => $totalLiveServices,
                'totalFullPackages' => $totalFullPackages,
                'totalPayments' => $totalPayments,
            ],
            'recentActivities' => [
                'bookings' => $recentBookings,
                'visaServices' => $recentVisaServices,
                'payments' => $recentPayments,
            ],
            'monthlyStats' => $monthlyStats,
        ]);
    }

    public function users()
    {
        $users = User::with(['bookings', 'visaServices', 'carRentals', 'liveServices', 'fullPackages'])
            ->latest()
            ->paginate(15);

        return response()->json($users);
    }

    public function bookings()
    {
        $bookings = Booking::with('user')->latest()->paginate(15);
        return response()->json($bookings);
    }

    public function visaServices()
    {
        $visaServices = VisaService::with('user')->latest()->paginate(15);
        return response()->json($visaServices);
    }

    public function carRentals()
    {
        $carRentals = CarRental::with('user')->latest()->paginate(15);
        return response()->json($carRentals);
    }

    public function liveServices()
    {
        $liveServices = LiveInMoroccoService::with('user')->latest()->paginate(15);
        return response()->json($liveServices);
    }

    public function fullPackages()
    {
        $fullPackages = FullPackage::with('user')->latest()->paginate(15);
        return response()->json($fullPackages);
    }

    public function payments()
    {
        $payments = Payment::with('user')->latest()->paginate(15);
        return response()->json($payments);
    }

    public function updateBookingStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $request->status]);
        
        return response()->json(['message' => 'Booking status updated successfully', 'booking' => $booking]);
    }

    public function updateVisaServiceStatus(Request $request, $id)
    {
        $visaService = VisaService::findOrFail($id);
        $visaService->update(['status' => $request->status]);
        
        return response()->json(['message' => 'Visa service status updated successfully', 'visaService' => $visaService]);
    }

    public function updateCarRentalStatus(Request $request, $id)
    {
        $carRental = CarRental::findOrFail($id);
        $carRental->update(['status' => $request->status]);
        
        return response()->json(['message' => 'Car rental status updated successfully', 'carRental' => $carRental]);
    }

    public function updateLiveServiceStatus(Request $request, $id)
    {
        $liveService = LiveInMoroccoService::findOrFail($id);
        $liveService->update(['status' => $request->status]);
        
        return response()->json(['message' => 'Live service status updated successfully', 'liveService' => $liveService]);
    }

    public function updateFullPackageStatus(Request $request, $id)
    {
        $fullPackage = FullPackage::findOrFail($id);
        $fullPackage->update(['status' => $request->status]);
        
        return response()->json(['message' => 'Full package status updated successfully', 'fullPackage' => $fullPackage]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function deleteBooking($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();
        
        return response()->json(['message' => 'Booking deleted successfully']);
    }

    public function deleteVisaService($id)
    {
        $visaService = VisaService::findOrFail($id);
        $visaService->delete();
        
        return response()->json(['message' => 'Visa service deleted successfully']);
    }

    public function deleteCarRental($id)
    {
        $carRental = CarRental::findOrFail($id);
        $carRental->delete();
        
        return response()->json(['message' => 'Car rental deleted successfully']);
    }

    public function deleteLiveService($id)
    {
        $liveService = LiveInMoroccoService::findOrFail($id);
        $liveService->delete();
        
        return response()->json(['message' => 'Live service deleted successfully']);
    }

    public function deleteFullPackage($id)
    {
        $fullPackage = FullPackage::findOrFail($id);
        $fullPackage->delete();
        
        return response()->json(['message' => 'Full package deleted successfully']);
    }
} 