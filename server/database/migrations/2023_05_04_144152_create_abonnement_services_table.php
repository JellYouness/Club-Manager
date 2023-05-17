<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Abonnement;
use App\Models\Service;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('abonnement-service', function (Blueprint $table) {
            $table->foreignIdFor(Abonnement::class)->onDelete(null);
            $table->foreignIdFor(Service::class)->onDelete(null);
            $table->primary(['service_id','abonnement_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('abonnement_services');
    }
};
