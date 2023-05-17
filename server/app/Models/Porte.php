<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Porte extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 
        'service_id', 
        'status'
    ];

    public function service(){
        return $this->belongsTo(Service::class);
    }
}
