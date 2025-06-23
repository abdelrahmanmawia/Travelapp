<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveInMoroccoService extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'housing',
        'sim_card',
        'admin_support',
        'price',
        'media',
    ];

    protected $casts = [
        'media' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function booking() {
        return $this->morphOne(Booking::class, 'serviceable');
    }
}
