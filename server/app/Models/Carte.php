<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carte extends Model
{
    use HasFactory;

    protected $fillable = [
        'adherent_id',
        'serie',
        'status'
    ];

    protected $dateFormat = 'Y/m/d H:i:s';

    public function adherent(){
        return $this->belongsTo(Adherent::class);
    }
}
