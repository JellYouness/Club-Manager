<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'ip',
        'serie',
        'status',
        'porte_id',
    ];
    

    public function porte(){
        return $this->belongsTo(Porte::class);
    }
}
