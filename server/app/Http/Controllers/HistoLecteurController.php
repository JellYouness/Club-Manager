<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Histo_lecteur;
use Illuminate\Support\Facades\Validator;

class HistoLecteurController extends Controller
{
    public function index()
    {
        $histoLecteurs = Histo_lecteur::all();
        return response()->json($histoLecteurs);
    }

    public function show($id)
    {
        $histoLecteur = Histo_lecteur::find($id);
        if(is_null($histoLecteur)){
            return response()->json([
                'message' => 'histo_lecteur not found',
            ],400);
        }

        return response()->json($histoLecteur);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'carte_id' => ['required', 'exists:cartes,id'],
            'lecteur_id' => ['required', 'exists:lecteurs,id'],
            'type' => ['required', 'string', 'in:entrée,sortie'],
            'date_heure' => ['required', 'date']
        ]);

        if($validator->fails()){
            return response()->json([
                'message' =>'sorry not stored',
                'error' => $validator->errors()
            ]);
        }

        $histoLecteur = Histo_lecteur::create($input);
        return response()->json([
            'message' => 'histo_lecteur created successfully',
            'data' => $histoLecteur
        ]);
    }

    public function update(Request $request, Histo_lecteur $histoLecteur)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'carte_id' => ['sometimes', 'exists:cartes,id'],
            'lecteur_id' => ['sometimes', 'exists:lecteurs,id'],
            'type' => ['sometimes', 'string', 'in:entrée,sortie'],
            'date_heure' => ['sometimes', 'date']
        ]);

        if($validator->fails()){
            return response()->json([
                'message' =>'sorry not stored',
                'error' => $validator->errors()
            ]);
        }

        $histoLecteur->fill($input);
        $histoLecteur->save();

        return response()->json([
            'message' => 'histo_lecteur updated successfully',
            'data' => $histoLecteur
        ]);
    }

    public function destroy(Histo_lecteur $histoLecteur)
    {
        $histoLecteur->delete();
        
        return response()->json([
            'message' => 'histo_lecteur deleted successfully',
            'data' => $histoLecteur
        ]);
    }
}

