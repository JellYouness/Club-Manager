<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::post('register',[PassportAuthController::class,'register']);
Route::post('login',[PassportAuthController::class,'login']);

Route::middleware('auth:api')->group(function(){

});
Route::resource('abonnements',AbonnementController::class);
Route::resource('adherents',AdherentController::class);
Route::resource('cartes',CarteController::class);
Route::resource('lecteurs',LecteurController::class);
Route::resource('historiques',HistoLecteurController::class);
Route::resource('portes',PorteController::class);
Route::resource('produits',ProduitController::class);
Route::resource('services',ServiceController::class);
