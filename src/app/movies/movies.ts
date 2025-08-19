import { Component, signal, OnInit } from '@angular/core';
import { NgFor, DecimalPipe, NgClass } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trending } from '../trending/trending';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [NgFor, HttpClientModule, DecimalPipe, NgClass,Trending],
  templateUrl: './movies.html',
  styleUrls: ['./movies.css']
})
export class Movies implements OnInit {
  private apiKey = '072e8885c0871676d8eadaee59eb40ec';
  private apiUrl = `https://api.themoviedb.org/3`;

  movies = signal<any[]>([]);
  genresMap = new Map<number, string>();

  currentPage = 1;
  totalPages = 100;
  visiblePages: number[] = [];

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    this.loadGenres().subscribe({
      next: (response) => {
        response.genres.forEach((g: any) => this.genresMap.set(g.id, g.name));
        this.loadMovies(1);
      },
      error: (err) => console.error('Error loading genres:', err)
    });
  }

  getMovies(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
        language: 'en-US'
      }
    });
  }

  loadGenres(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/genre/movie/list`, {
      params: { api_key: this.apiKey, language: 'en-US' }
    });
  }

  loadMovies(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;

    this.getMovies(page).subscribe({
      next: (res) => {
        const limitedMovies = res.results.slice(0, 6).map((m: any) => ({ ...m, liked: false }));
        this.movies.set(limitedMovies);

        this.totalPages = res.total_pages;
        this.updateVisiblePages();
      },
      error: (err) => console.error('Error loading movies:', err)
    });
  }

  updateVisiblePages(): void {
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, this.currentPage + 2);
    this.visiblePages = [];
    for (let i = start; i <= end; i++) {
      this.visiblePages.push(i);
    }
  }

  getGenresForMovie(genreIds: number[]): string {
    return genreIds
      .map(id => this.genresMap.get(id))
      .filter(Boolean)
      .join(', ');
  }

  logMovieId(id: number): void {
    console.log('Movie ID:', id);
  }

  toggleLike(movie: any): void {
    movie.liked = !movie.liked;
  }
}
