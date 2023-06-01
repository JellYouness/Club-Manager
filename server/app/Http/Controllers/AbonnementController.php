<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Abonnement;
use Illuminate\Support\Facades\Validator;

class AbonnementController extends Controller
{
    public function index()
    {
        $abonnements = Abonnement::all();

        return response()->json($abonnements);
    }

    public function show($id)
    {
        $abonnement = Abonnement::find($id);

        if (is_null($abonnement)) {
            return response()->json([
                'message' => 'Abonnement not found',
            ], 404);
        }

        return response()->json( $abonnement);
    }

    public function store(Request $request)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'nom' => ['required','string'],
            'adherent_id' => ['required', 'exists:adherents,id'],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['required', 'date', 'after:date_debut']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' =>'Sorry, the abonnement was not created',
                'error' => $validator->errors()
            ]);
        }

        $abonnement = Abonnement::create($input);

        return response()->json([
            'message' => 'Abonnement created successfully',
            'data' => $abonnement
        ]);
    }

    public function update(Request $request, Abonnement $abonnement)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'adherent_id' => ['exists:adherents,id'],
            'date_debut' => ['date'],
            'date_fin' => ['date', 'after:date_debut']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' =>'Sorry, the abonnement was not updated',
                'error' => $validator->errors()
            ]);
        }

        $abonnement->fill($input);
        $abonnement->save();

        return response()->json([
            'message' => 'Abonnement updated successfully',
            'data' => $abonnement
        ]);
    }

    public function destroy(Abonnement $abonnement)
    {
        $abonnement->delete();

        return response()->json([
            'message' => 'Abonnement deleted successfully',
            'data' => $abonnement
        ]);
    }
}

