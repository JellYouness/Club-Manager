<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    public function index(){
        $services = Service::all();
        return response()->json( $services );
    }
    
    public function show($id){
        $service = Service::find($id);

        if(is_null($service)){
            return response()->json([
                'fail'=> false,
                'message'=> 'Sorry not found!' 
            ],400);
        }

        return response()->json($service);
    }

    public function store(Request $request){
        $input = $request->all();
        $validator = Validator::make($input,[
            'nom' => ['required', 'string', 'max:255'],
            'prix' => ['required', 'numeric', 'min:0'],
            'reference' => ['required', 'string', 'max:255'],
            'status' => ['required', 'boolean'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        if( $validator->fails()){
            return response()->json([
                'fail'=> false,
                'message'=> 'Sorry not stored',
                'error'=> $validator->errors()
            ],400);
        }

        $service =  Service::create($input);

        return response()->json([
            'message'=> 'Service created successfully',
            'data'=> $service
        ]);
    }

    public function update(Request $request, Service $service){
        $input = $request->all();
        $validator = Validator::make($input,[
            'nom' => ['required', 'string', 'max:255'],
            'prix' => ['required', 'numeric', 'min:0'],
            'reference' => ['required', 'string', 'max:255'],
            'status' => ['required', 'boolean'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        if( $validator->fails()){
            return response()->json([
                'fail'=> false,
                'message'=> 'Sorry not updated',
                'error'=> $validator->errors()
            ],400);
        }

        $service->fill($input);
        $service->save();

        return response()->json([
            'success'=> true,
            'message'=> 'Service updated successfully',
            'data'=> $service
        ]);
    }

    public function destroy(Service $service){
        $service->delete();

        return response()->json([
            'message'=> 'Service deleted successfully',
            'data'=> $service
        ]);
    }
}

