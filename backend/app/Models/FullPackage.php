<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FullPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'visa',
        'air_ticket',
        'transport',
        'program',
        'airport_pickup',
        'status',
    ];

    protected $casts = [
        'visa' => 'boolean',
        'air_ticket' => 'boolean',
        'transport' => 'boolean',
        'program' => 'boolean',
        'airport_pickup' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function booking() {
        return $this->morphOne(Booking::class, 'serviceable');
    }

}
