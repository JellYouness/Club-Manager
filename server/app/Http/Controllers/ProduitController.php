<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produit;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProduitController extends Controller
{
    public function index(){
        $produit = Produit::all();
        return response()->json($produit);
    }


    public function show($id){
        $produit = Produit::find($id);

        if(is_null($produit)){
            return response()->json([
                'message' => 'produit not found',
            ],400);
        }

        return response()->json($produit);
    }

    public function store(Request $request){
        $input = $request->all();
        $validator = Validator::make($input,[
            'nom' => ['required', 'string'],
            'prix' => ['required', 'numeric', 'min:0'],
            'reference' => ['required', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string']
        ]);

        if($validator->fails()){
            return response()->json([
                'message' =>'sorry not stored',
                'error' => $validator->errors()
            ]);
        }

        if($request->image){
        $base64 = explode(",", $request->image);
                $image = base64_decode($base64[1]);
                $filename = 'images/'.time() . '.' . 'png';
                Storage::put('public/'.$filename, $image);
                $input['image'] = $filename;
        }

        $produit = Produit::create($input);
        return response()->json([
            'message' => 'produit created successfully',
            'data' => $produit
        ]);
    }

    public function update(Request $request, Produit $produit){
        $input = $request->all();
        $validator = Validator::make($input,[
            'nom' => ['required', 'string'],
            'prix' => ['required', 'numeric', 'min:0'],
            'reference' => ['required', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string']
        ]);

        if($validator->fails()){
            return response()->json([
                'message' =>'sorry not stored',
                'error' => $validator->errors()
            ]);
        }

        if($request->image){
        $base64 = explode(",", $request->image);
                $image = base64_decode($base64[1]);
                $filename = 'images/'.time() . '.' . 'png';
                Storage::put('public/'.$filename, $image);
                $input['image'] = $filename;
        }

        $produit->fill($input);
        $produit->save();

        return response()->json([
            'message' => 'produit updated successfully',
            'data' => $produit
        ]);
    }

    public function destroy(Produit $produit){
        $produit->delete();
        
        return response()->json([
            'message' => 'produit deleted successfully',
            'data' => $produit
        ]);
    }
}
