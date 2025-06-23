<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'serviceable_id',
        'serviceable_type',
        'status',
        'paid',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function serviceable()
    {
        return $this->morphTo();
    }


    public function payment() {
        return $this->hasOne(Payment::class);
    }
}
