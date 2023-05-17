<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Porte;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lecteurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->ipAddress('ip');
            $table->integer('serie');
            $table->boolean('status');
            $table->foreignIdFor(Porte::class)->onDelete(null);
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
        Schema::dropIfExists('lecteurs');
    }
};
