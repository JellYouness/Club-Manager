<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Porte;
use Illuminate\Support\Facades\Validator;

class PorteController extends Controller
{
    public function index(){
        $portes = Porte::with('service')->get();
        return response()->json($portes);
    }


    public function show($id){
        $porte = Porte::find($id);

        if(is_null($porte)){
            return response()->json([
                'message' => 'porte not found',
            ],400);
        }

        return response()->json($porte);
    }

    public function store(Request $request){
        $input = $request->all();
        $validator = Validator::make($input,[
            'nom' => ['required', 'string'],
            'service_id' => ['required', 'exists:services,id'],
            'status' => ['required', 'boolean']
        ]);

        if($validator->fails()){
            return response()->json([
                'message' =>'sorry not stored',
                'error' => $validator->errors()
            ]);
        }

        $porte = Porte::create($input);
        return response()->json([
            'message' => 'porte created successfully',
            'data' => $porte
        ]);
    }

    public function update(Request $request, Porte $porte){
        $input = $request->all();
        $validator = Validator::make($input,[
            'nom' => ['required', 'string'],
            'service_id' => ['required', 'exists:services,id'],
            'status' => ['required', 'boolean']
        ]);

        if($validator->fails()){
            return response()->json([
                'message' =>'sorry not stored',
                'error' => $validator->errors()
            ]);
        }

        $porte->fill($input);
        $porte->save();

        return response()->json([
            'message' => 'porte updated successfully',
            'data' => $porte
        ]);
    }

    public function destroy(Porte $porte){
        $porte->delete();
        
        return response()->json([
            'message' => 'porte deleted successfully',
            'data' => $porte
        ]);
    }
}