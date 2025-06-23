<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarRental extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'car_name',
        'price',
        'license_age',
        'license_photo',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function booking() {
        return $this->morphOne(Booking::class, 'serviceable');
    }
}
