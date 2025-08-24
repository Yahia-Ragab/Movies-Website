import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RecommendedFilms } from "../recommended-films/recommended-films";

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, DecimalPipe,RecommendedFilms],
  templateUrl: './movie-details.html',
  styleUrls: ['./movie-details.css']
})
export class MovieDetails implements OnInit {
recommendedMovies() {
throw new Error('Method not implemented.');
}
  private apiKey = '072e8885c0871676d8eadaee59eb40ec';
  private apiUrl = `https://api.themoviedb.org/3`;

  movie = signal<any>(null);
  movies = signal<any>(null);
selectedMovie: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMovieDetails(id);
    }
  }

  loadMovieDetails(id: string): void {
    this.http.get<any>(`${this.apiUrl}/movie/${id}`, {
      params: { api_key: this.apiKey, language: 'en-US' }
    }).subscribe({
      next: (res) => this.movie.set(res),
      error: (err) => console.error('Error loading movie details:', err)
    });
  }
}
