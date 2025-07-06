<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Book;
use PHPUnit\Framework\Attributes\Test;


class BookControllerTest extends TestCase
{
    use RefreshDatabase;

    private function setupBooks()
    {
        Book::factory()->create(['title' => 'The Hobbit', 'author' => 'J.R.R. Tolkien']);
        Book::factory()->create(['title' => '1984', 'author' => 'George Orwell']);
        Book::factory()->create(['title' => 'Harry Potter', 'author' => 'J.K. Rowling']);
        Book::factory()->create(['title' => 'the Tale of Peter Rabbit', 'author' => 'Beatrix Potter']);
    }

    public function test_it_returns_all_books()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books');
        $response->assertStatus(200);
        $response->assertJsonCount(4);
        $response->assertJsonFragment(['title' => '1984', 'author' => 'George Orwell']);
        $response->assertJsonFragment(['title' => 'The Hobbit', 'author' => 'J.R.R. Tolkien']);
        $response->assertJsonFragment(['title' => 'Harry Potter', 'author' => 'J.K. Rowling']);
        $response->assertJsonFragment(['title' => 'the Tale of Peter Rabbit', 'author' => 'Beatrix Potter']);

    }

    public function test_it_gets_empty_books()
    {
        $response = $this->getJson('/api/books');
        $response->assertStatus(200)
                 ->assertJsonCount(0)
                 ->assertJsonFragment([]);
    }

    public function test_it_searches_by_title_or_author()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books?search=orwell');
        $response->assertStatus(200);
        $response->assertJsonFragment(['title' => '1984', 'author' => 'George Orwell']);
        $response->assertJsonMissing(['title' => 'The Hobbit', 'author' => 'J.R.R. Tolkien']);
        $response->assertJsonMissing(['title' => 'Harry Potter', 'author' => 'J.K. Rowling']);
        $response->assertJsonMissing(['title' => 'the Tale of Peter Rabbit', 'author' => 'Beatrix Potter']);

        $response = $this->getJson('/api/books?search=hobbit');
        $response->assertStatus(200);
        $response->assertJsonMissing(['title' => '1984', 'author' => 'George Orwell']);
        $response->assertJsonFragment(['title' => 'The Hobbit', 'author' => 'J.R.R. Tolkien']);
        $response->assertJsonMissing(['title' => 'Harry Potter', 'author' => 'J.K. Rowling']);
        $response->assertJsonMissing(['title' => 'the Tale of Peter Rabbit', 'author' => 'Beatrix Potter']);


    }

    public function test_it_searches_by_title_only()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books?searchTitle=r');
        $response->assertStatus(200);
        $response->assertJsonFragment(['title' => 'Harry Potter', 'author' => 'J.K. Rowling']);
        $response->assertJsonMissing(['title' => 'The Hobbit', 'author' => 'J.R.R. Tolkien']);
        $response->assertJsonMissing(['title' => '1984', 'author' => 'George Orwell']);
        $response->assertJsonFragment(['title' => 'the Tale of Peter Rabbit', 'author' => 'Beatrix Potter']);

    }

    public function test_it_searches_by_author_only()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books?searchAuthor=potter');
        $response->assertStatus(200);
        $response->assertJsonMissing(['title' => 'Harry Potter', 'author' => 'J.K. Rowling']);
        $response->assertJsonMissing(['title' => 'The Hobbit', 'author' => 'J.R.R. Tolkien']);
        $response->assertJsonMissing(['title' => '1984', 'author' => 'George Orwell']);
        $response->assertJsonFragment(['title' => 'the Tale of Peter Rabbit', 'author' => 'Beatrix Potter']);
    }

    public function test_it_searches_by_title_and_author()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books?searchAuthor=potter&searchTitle=a');
        $response->assertStatus(200);
        $response->assertJsonMissing(['title' => 'Harry Potter', 'author' => 'J.K. Rowling']);
        $response->assertJsonMissing(['title' => 'The Hobbit', 'author' => 'J.R.R. Tolkien']);
        $response->assertJsonMissing(['title' => '1984', 'author' => 'George Orwell']);
        $response->assertJsonFragment(['title' => 'the Tale of Peter Rabbit', 'author' => 'Beatrix Potter']);
    }

    public function test_it_sorts_by_title_ascending()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books?sortBy=title&sortOrder=asc');
        $response->assertStatus(200);
        
        $actualTitles = collect($response->json())->pluck('title')->values()->all();

        $expectedTitles = [
        "1984",
        "Harry Potter",
        "The Hobbit", 
        "the Tale of Peter Rabbit",
        ];

        $this->assertEquals($expectedTitles, $actualTitles);
    }

    public function test_it_sorts_by_title_descending()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books?sortBy=title&sortOrder=desc');
        $response->assertStatus(200);
        
        $actualTitles = collect($response->json())->pluck('title')->values()->all();

        $expectedTitles = [
        "the Tale of Peter Rabbit", 
        "The Hobbit",
        "Harry Potter",
        "1984",
        ];

        $this->assertEquals($expectedTitles, $actualTitles);
    }

    public function test_it_sorts_by_author_ascending()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books?sortBy=author&sortOrder=asc');
        $response->assertStatus(200);
        
        $actualTitles = collect($response->json())->pluck('title')->values()->all();

        $expectedTitles = [
        "the Tale of Peter Rabbit",
        "1984",
        "Harry Potter",
        "The Hobbit", 
        ];

        $this->assertEquals($expectedTitles, $actualTitles);
    }

    public function test_it_sorts_by_author_descending()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books?sortBy=author&sortOrder=desc');
        $response->assertStatus(200);
        
        $actualTitles = collect($response->json())->pluck('title')->values()->all();

        $expectedTitles = [
        "The Hobbit", 
        "Harry Potter",
        "1984",
        "the Tale of Peter Rabbit",
        ];

        $this->assertEquals($expectedTitles, $actualTitles);
    }

    public function test_it_default_sorts_by_created_at_ascending()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books');
        $response->assertStatus(200);
        
        $actualTitles = collect($response->json())->pluck('title')->values()->all();

        $expectedTitles = [
        "The Hobbit", 
        "1984",
        "Harry Potter",
        "the Tale of Peter Rabbit",
        ];

        $this->assertEquals($expectedTitles, $actualTitles);
    }

    public function test_it_returns_bad_request_for_invalid_sortOrder()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books?sortBy=title&sortOrder=something');
        $response->assertStatus(400);
    }

    public function test_it_returns_bad_request_for_invalid_sortBy()
    {
        $this->setupBooks();

        $response = $this->getJson('/api/books?sortBy=something&sortOrder=asc');
        $response->assertStatus(400);
    }

    public function test_it_adds_new_book()
    {
        $data = ['title' => 'The Handmaid\'s Tale', 'author' => 'Margaret Atwood'];

        $response = $this->postJson('/api/books', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment($data);

        $this->assertDatabaseHas('books', $data);
    }

    public function test_it_cannot_add_duplicate_book()
    {
        $book = Book::factory()->create(['title' => '1984', 'author' => 'George Orwell']);

        $response = $this->postJson('/api/books', ['title' => '1984', 'author' => 'George Orwell']);

        $response->assertStatus(422);
        $response->assertJson(['message' => 'A book with the same title and author already exists.']);
        $this->assertEquals(1, Book::count());
    }

    public function test_it_can_update_author()
    {
        $book = Book::factory()->create(['author' => 'Original']);

        $response = $this->putJson("/api/books/author/{$book->id}", ['author' => 'Updated']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('books', ['id' => $book->id, 'author' => 'Updated']);
    }

    public function test_it_cannot_update_to_duplicate_book()
    {
        $bookData1 = Book::factory()->create(['title' => '1984', 'author' => 'George Orwell']);
        $bookData2 = Book::factory()->create(['title' => '1984', 'author' => 'George Ofwell']);

        $response =  $this->putJson("/api/books/author/{$bookData2->id}", ['author' => 'George Orwell']);

        $response->assertStatus(422);
        $response->assertJson([
            'message' => 'A book with the same title and author already exists.'
        ]);
        $this->assertEquals(2, Book::count());
        $this->assertDatabaseHas('books', ['id' => $bookData1->id, 'author' => 'George Orwell']);
        $this->assertDatabaseHas('books', ['id' => $bookData2->id, 'author' => 'George Ofwell']);
    }

    public function test_delete_book_should_return_200()
    {
        $book = Book::factory()->create();

        $response = $this->deleteJson("/api/books/{$book->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('books', ['id' => $book->id]);
    }

    public function test_delete_non_existent_book_should_return_404()
    {
        $book = Book::factory()->create();

        $response = $this->deleteJson("/api/books/{$book->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('books', ['id' => $book->id]);

        $response = $this->deleteJson("/api/books/{$book->id}");

        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'Book not found.'
        ]);
        $this->assertDatabaseMissing('books', ['id' => $book->id]);
    }
}
