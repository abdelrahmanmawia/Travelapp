<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand',
        'price',
        'available',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
        'available' => 'boolean',
    ];

    public function carRentals() {
        return $this->hasMany(CarRental::class);
    }

    
}
