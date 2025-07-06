<?php

namespace App\Http\Controllers;      

use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $sortBy = $request->query('sortBy', 'created_at');
        $sortOrder = $request->query('sortOrder', 'asc');

        $allowedSorts = ['title', 'author', 'created_at', 'updated_at'];
        $allowedSortOrder = ['asc', 'desc'];

        if (!in_array($sortBy, $allowedSorts) || !in_array($sortOrder, $allowedSortOrder)) {
            return response()->json([
                'message' => 'Invalid request',
                'error' => 'Invalid request',
            ], 400);
        }

        $query = Book::query();

        if ($titleSearch = $request->query('searchTitle')) {
            $query->where('title', 'like', "%{$titleSearch}%");
        }

        if ($authorSearch = $request->query('searchAuthor')) {
            $query->where('author', 'like', "%{$authorSearch}%");
        }

        if (!$titleSearch && !$authorSearch && $search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                ->orWhere('author', 'like', "%{$search}%");
            });
        }

        $query->orderByRaw("LOWER({$sortBy}) {$sortOrder}");
        
        return $query->get();
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
        ]);

        try {
            return response(Book::create($validated), 201);
        } catch (\Exception $e) {
            if ($e->getCode() == 23000) {
                return response()->json([
                    'message' => 'A book with the same title and author already exists.'
                ], 422);
            }  

            return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'message' => 'Book not found.'
            ], 404);
        }
        return Book::where('id',$id)->delete();
    }
    
    public function update(Request $request, $id)
    {
        $request->validate(['author' => 'required|string']);
        try {
            return Book::where('id', $id)->update(['author' => $request->author]);
        } catch (\Exception $e) {
            if ($e->getCode() == 23000) {
                return response()->json([
                    'message' => 'A book with the same title and author already exists.'
                ], 422);
            }  

            return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
}
