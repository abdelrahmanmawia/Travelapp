<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appartement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'address',
        'city',
        'price_per_night',
        'bedrooms',
        'bathrooms',
        'max_guests',
        'amenities',
        'available',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
        'available' => 'boolean',
        'bedrooms' => 'integer',
        'bathrooms' => 'decimal:1',
        'max_guests' => 'integer',
        'price_per_night' => 'decimal:2',
    ];

    public function liveInMoroccoServices() {
        return $this->hasMany(LiveInMoroccoService::class);
    }
}
