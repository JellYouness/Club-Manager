<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Adherent;
use App\Models\Carte;
use App\Models\Lecteur;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('histo_lecteurs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Carte::class)->onDelete(null);
            $table->foreignIdFor(Lecteur::class)->onDelete(null);
            $table->enum('type',['entrée','sortie']);
            $table->dateTime('date_heure');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('histo_lecteurs');
    }
};
