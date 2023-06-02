<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lecteur;
use Illuminate\Support\Facades\Validator;

class LecteurController extends Controller
{
    public function index(){
        $lecteurs = Lecteur::with('porte')->get();
        return response()->json($lecteurs);
    }

    public function show($id){
        $lecteur = Lecteur::find($id);

        if(is_null($lecteur)){
            return response()->json([
                'message' => 'Lecteur not found',
            ], 400);
        }

        return response()->json($lecteur);
    }

    public function store(Request $request){
        $input = $request->all();
        $validator = Validator::make($input,[
            'nom' => ['required', 'string'],
            'ip' => ['required', 'ip'],
            'serie' => ['required', 'integer'],
            'status' => ['required', 'boolean'],
            'porte_id' => ['required', 'exists:portes,id'],
        ]);

        if($validator->fails()){
            return response()->json([
                'message' =>'Sorry, cannot store Lecteur',
                'error' => $validator->errors()
            ], 400);
        }

        $lecteur = Lecteur::create($input);
        return response()->json([
            'message' => 'Lecteur created successfully',
            'data' => $lecteur
        ]);
    }

    public function update(Request $request, Lecteur $lecteur){
        $input = $request->all();
        $validator = Validator::make($input,[
            'nom' => ['required', 'string'],
            'ip' => ['required', 'ip'],
            'serie' => ['required', 'integer'],
            'status' => ['required', 'boolean'],
            'porte_id' => ['required', 'exists:portes,id'],
        ]);

        if($validator->fails()){
            return response()->json([
                'message' =>'Sorry, cannot update Lecteur',
                'error' => $validator->errors()
            ], 400);
        }

        $lecteur->fill($input);
        $lecteur->save();

        return response()->json([
            'message' => 'Lecteur updated successfully',
            'data' => $lecteur
        ]);
    }

    public function destroy(Lecteur $lecteur){
        $lecteur->delete();
        
        return response()->json([
            'message' => 'Lecteur deleted successfully',
            'data' => $lecteur
        ]);
    }
}

