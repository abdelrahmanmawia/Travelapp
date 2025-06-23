<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FullPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'includes',
        'total_price',
    ];

    protected $casts = [
        'includes' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function booking() {
        return $this->morphOne(Booking::class, 'serviceable');
    }
}
