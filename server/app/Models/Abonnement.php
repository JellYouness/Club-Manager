<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Abonnement extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'adherent_id',
        'date_debut',
        'date_fin'
    ];

    public function adherent(){
        return $this->belongsTo(Adherent::class);
    }

    public function service(){
        return $this->belongsToMany(Service::class, 'abonnement_services');
    }
}
