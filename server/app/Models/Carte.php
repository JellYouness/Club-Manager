<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carte extends Model
{
    use HasFactory;

    protected $fillable = [
        'adherent_id',
        'date_creation',
        'status'
    ];

    public function adherent(){
        return $this->belongsTo(Adherent::class);
    }
}
