<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'amount',
        'method',
        'payment_status',
        'transaction_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_status' => 'string',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
