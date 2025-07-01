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
        'total_price',
    ];

    protected $casts = [
        'visa' => 'array',
        'air_ticket' => 'array',
        'transport' => 'array',
        'program' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function booking() {
        return $this->morphOne(Booking::class, 'serviceable');
    }
}
