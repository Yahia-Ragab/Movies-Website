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

  likedMovies: any[] = [];  // ✅ now full objects

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    this.likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
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
        const limitedMovies = res.results.slice(0, 8).map((m: any) => ({
          ...m,
          liked: this.likedMovies.some((lm: any) => lm.id === m.id)
        }));
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

    if (movie.liked) {
      const exists = this.likedMovies.find((m: any) => m.id === movie.id);
      if (!exists) {
        this.likedMovies.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          genre_ids: movie.genre_ids
        });
      }
    } else {
      this.likedMovies = this.likedMovies.filter((m: any) => m.id !== movie.id);
    }

    localStorage.setItem('likedMovies', JSON.stringify(this.likedMovies));
  }
}
