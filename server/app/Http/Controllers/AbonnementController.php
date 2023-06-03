<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Abonnement;
use App\Models\AbonnementService;

class AbonnementController extends Controller
{
    public function index()
    {
        $abonnements = Abonnement::with('adherent')->get();

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

        $validator2 = Validator::make($input,[
            'service_id' => ['required', 'exists:services,id']
        ]);

        foreach ($input['service'] as $key=>$val) {
            AbonnementService::create(['abonnement_id' =>$abonnement->id,'service_id' => $val]);
        };
        


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

