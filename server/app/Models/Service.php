<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prix',
        'reference',
        'stock',
        'description',
        'image'
    ];

    public function abonnement(){
        return $this->belongsToMany(Abonnement::class, 'abonnement_service');
    }
}
