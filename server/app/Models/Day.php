<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Day extends Model
{
    use HasFactory;

    protected $fillable = ['nom'];

    public function gender(){
        return $this->belongsToMany(Gender::class)->as('dayGender')->withPivot('status');
    }
}
