<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Daygender extends Model
{
    use HasFactory;

    protected $fillable = [
        'gender_id',
        'day_id'
    ];
}
