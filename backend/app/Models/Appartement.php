<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appartement extends Model
{
    use HasFactory;

    protected $fillable = [
        'address',
        'price',
        'rooms',
        'available',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
        'available' => 'boolean',
    ];

    public function liveInMoroccoServices() {
        return $this->hasMany(LiveInMoroccoService::class);
    }

}
