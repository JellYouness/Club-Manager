<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Adherent;
use Illuminate\Support\Facades\Validator;

class AdherentController extends Controller
{
    public function index(){
        $adherent = Adherent::all();
        return response()->json($adherent);
    }
    
    public function show( $id){
        $adherent = Adherent::find($id);

        if(is_null($adherent)){
            return response()->json([
                'fail'=> false,
                'message'=> 'Sorry not found!' 
                ],400);
        }

        return response()->json([
            'message'=> 'adherent fetched successfully',
            'data'=> $adherent
            ]);
    }

    
    public function store(Request $request){
        $input = $request->all();
        $validator = Validator::make($input,[
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'cin' => ['required', 'string', 'max:10'],
            'email' => ['required', 'email', 'max:255'],
            'telephone' => ['required', 'numeric', 'digits_between:8,15'],
            'naissance' => ['required', 'date'],
            'civilité' => ['required', 'in:male,female'],
            'matricule' => ['required', 'numeric', 'digits_between:8,15'],
            'status' => ['required', 'boolean'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        if( $validator->fails()){
            return response()->json([
                'fail'=> false,
                'message'=> 'Sorry not stored',
                'error'=> $validator->errors()
                ],400);
        }

        $adherent =  Adherent::create($input);

        return response()->json([
            'message'=> 'adherent created successfully',
            'data'=> $adherent
            ]);
    }


    public function update(Request $request, Adherent $adherent){
       
        $input = $request->all();
        $validator = Validator::make($input,[
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'cin' => ['required', 'string', 'max:10'],
            'email' => ['required', 'email', 'max:255'],
            'telephone' => ['required', 'numeric', 'digits_between:8,15'],
            'naissance' => ['required', 'date'],
            'civilité' => ['required', 'in:male,female'],
            'matricule' => ['required', 'numeric', 'digits_between:8,15'],
            'status' => ['required', 'boolean'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        if( $validator->fails()){
            return response()->json([
                'fail'=> false,
                'message'=> 'Sorry not stored',
                'error'=> $validator->errors()
                ],400);
        }

        $adherent->fill($input);
        $adherent->save();

        return response()->json([
            'success'=> true,
            'message'=> 'product updated successfully',
            'data'=> $adherent
            ]);
    }


    public function destroy(Adherent $adherent){
        
        $adherent->delete();

        return response()->json([
            'message'=> 'product deleted successfully',
            'data'=> $adherent
            ]);
    }
}
