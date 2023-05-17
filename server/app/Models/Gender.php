<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gender extends Model
{
    use HasFactory;

    protected $fillable = ['nom'];

    public function day(){
        return $this->belongsToMany(Day::class)->as('dayGender')->withPivot('status');
    }
}
