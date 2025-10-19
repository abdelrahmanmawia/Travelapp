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
        'rooms',
        'price',
        'description'
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable')->orderBy('order');
    }

    public function liveInMoroccoServices() {
        return $this->hasMany(LiveInMoroccoService::class);
    }
}
