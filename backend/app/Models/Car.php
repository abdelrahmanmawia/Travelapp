<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand',
        'model',
        'year',
        'price_per_day',
        'location',
        'seats',
        'transmission',
        'fuel_type',
        'available',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
        'available' => 'boolean',
        'year' => 'integer',
        'seats' => 'integer',
        'price_per_day' => 'decimal:2',
    ];

    public function carRentals() {
        return $this->hasMany(CarRental::class);
    }
}
