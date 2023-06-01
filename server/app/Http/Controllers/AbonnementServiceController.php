<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AbonnementService;
use Illuminate\Support\Facades\Validator;

class AbonnementServiceController extends Controller
{
    public function index(){
        $abonnementService = AbonnementService::all();
        return response()->json($abonnementService);
    }
    
    public function store(Request $request){
        $input = $request->all();
        $validator = Validator::make($input,[
            'abonnement_id' => ['required', 'exists:abonnements,id'],
            'service_id' => ['required', 'exists:services,id'],
        ]);

        if( $validator->fails()){
            return response()->json([
                'fail'=> false,
                'message'=> 'Sorry not stored',
                'error'=> $validator->errors()
                ],400);
        }

        $abonnementService =  AbonnementService::create($input);

        return response()->json([
            'message'=> 'Abonnement service created successfully',
            'data'=> $abonnementService
            ]);
    }


    public function destroy(AbonnementService $abonnementService){
        
        $abonnementService->delete();

        return response()->json([
            'message'=> 'Abonnement service deleted successfully',
            'data'=> $abonnementService
            ]);
    }
}