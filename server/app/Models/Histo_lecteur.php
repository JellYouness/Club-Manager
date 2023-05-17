<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Histo_lecteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'carte_id',
        'lecteur_id',
        'type',
        'date_heure',
    ];
    

    public function adherent(){
        return $this->belongsTo(Carte::class);
    }
    public function lecteur(){
        return $this->belongsTo(Lecteur::class);
    }
}
