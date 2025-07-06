<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            ['title' => 'The Great Gatsby', 'author' => 'F. Scott Fitzgerald'],
            ['title' => 'To Kill a Mockingbird', 'author' => 'Harper Lee'],
            ['title' => '1984', 'author' => 'George Orwell'],
            ['title' => 'Pride and Prejudice', 'author' => 'Jane Austen'],
            ['title' => 'The Catcher in the Rye', 'author' => 'J.D. Salinger'],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}