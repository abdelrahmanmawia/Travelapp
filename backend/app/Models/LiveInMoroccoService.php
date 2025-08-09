<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveInMoroccoService extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'appartement_id',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function appartement() {
        return $this->belongsTo(Appartement::class);
    }
    public function booking() {
        return $this->morphOne(Booking::class, 'serviceable');
    }
}
