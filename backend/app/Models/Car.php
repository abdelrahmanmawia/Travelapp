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
        'price',
        'description'
    ];

    protected $casts = [
        'year' => 'integer',
        'price' => 'decimal:2',
    ];

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable')->orderBy('order');
    }

    public function carRentals() {
        return $this->hasMany(CarRental::class);
    }
}
