import { Component, signal, OnInit } from '@angular/core';
import { NgFor, NgClass, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [NgFor, NgClass, DecimalPipe],
  templateUrl: './trending.html',
  styleUrls: ['./trending.css']
})
export class Trending implements OnInit {
  private apiKey = '072e8885c0871676d8eadaee59eb40ec';
  private apiUrl = `https://api.themoviedb.org/3`;

  movies = signal<any[]>([]);
  currentPage = 1;
  totalPages = 100;
  genresMap = new Map<number, string>();
  visiblePages: number[] = [];

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    this.loadGenres();
    this.loadMovies(1);
  }

  getMovies(page: number = 1) {
    return this.http.get<any>(`${this.apiUrl}/trending/movie/week`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
        language: 'en-US'
      }
    });
  }

  loadMovies(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;

    this.getMovies(page).subscribe({
      next: (res) => {
        const limitedMovies = res.results.slice(0, 8).map((m: any) => ({ ...m, liked: false }));
        this.movies.set(limitedMovies);
        this.totalPages = res.total_pages;
        this.updateVisiblePages();
      },
      error: (err) => console.error('Error loading trending movies:', err)
    });
  }

  loadGenres(): void {
    this.http.get<any>(`${this.apiUrl}/genre/movie/list`, {
      params: { api_key: this.apiKey, language: 'en-US' }
    }).subscribe({
      next: (response) => {
        response.genres.forEach((g: any) => this.genresMap.set(g.id, g.name));
      },
      error: (err) => console.error('Error loading genres:', err)
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

  toggleLike(movie: any): void {
    movie.liked = !movie.liked;
  }
}