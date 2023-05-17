<?php

namespace App\Http\Controllers;

use App\Models\Carte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CarteController extends Controller
{
    public function index()
    {
        $cartes = Carte::all();
        return response()->json([
            'message' => 'All cards',
            'data' => $cartes
        ]);
    }

    public function show($id)
    {
        $carte = Carte::find($id);

        if(is_null($carte)) {
            return response()->json([
                'message' => 'Card not found'
            ], 400);
        }

        return response()->json([
            'message' => 'Card fetched successfully',
            'data' => $carte
        ]);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'adherent_id' => ['required', 'integer', 'exists:adherents,id'],
            'date_creation' => ['required', 'date'],
            'status' => ['required', 'boolean'],
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => 'Sorry, could not create the card',
                'error' => $validator->errors()
            ]);
        }

        $carte = Carte::create($input);
        return response()->json([
            'message' => 'Card created successfully',
            'data' => $carte
        ]);
    }

    public function update(Request $request, Carte $carte)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'adherent_id' => ['required', 'integer', 'exists:adherents,id'],
            'date_creation' => ['required', 'date'],
            'status' => ['required', 'boolean'],
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => 'Sorry, could not update the card',
                'error' => $validator->errors()
            ]);
        }

        $carte->fill($input);
        $carte->save();

        return response()->json([
            'message' => 'Card updated successfully',
            'data' => $carte
        ]);
    }

    public function destroy(Carte $carte)
    {
        $carte->delete();

        return response()->json([
            'message' => 'Card deleted successfully',
            'data' => $carte
        ]);
    }
}
