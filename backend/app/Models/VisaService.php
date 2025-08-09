<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisaService extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'country_of_birth',
        'date_of_birth',
        'residence_country',
        'validity',
        'status',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'validity' => 'integer',
        'status' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booking() {
        return $this->morphOne(Booking::class, 'serviceable');
    }
}
