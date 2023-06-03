<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbonnementService extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'abonnement_id',
        'service_id'
    ];
}
