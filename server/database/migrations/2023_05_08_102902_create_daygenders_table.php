<?php

use App\Models\Day;
use App\Models\Gender;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('day_gender', function (Blueprint $table) {
            $table->foreignIdFor(Gender::class)->onDelete(null);
            $table->foreignIdFor(Day::class)->onDelete(null);
            $table->boolean('status');
            $table->primary(['gender_id','day_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('daygenders');
    }
};
