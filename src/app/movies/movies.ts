import { Component, signal, OnInit } from '@angular/core';
import { NgFor, DecimalPipe, NgClass } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trending } from '../trending/trending';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [NgFor, HttpClientModule, DecimalPipe, NgClass, Trending, RouterLink],
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

  likedMovies: any[] = [];

  constructor(public http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      this.likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    }

    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchMovies(params['q']);
      } else {
        this.loadGenres().subscribe({
          next: (response) => {
            response.genres.forEach((g: any) => this.genresMap.set(g.id, g.name));
            this.loadMovies(1);
          },
          error: (err) => console.error('Error loading genres:', err)
        });
      }
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
        const limitedMovies = res.results.slice(0, 6).map((m: any) => ({
          ...m,
          liked: this.likedMovies.some((lm: any) => lm.id === m.id)
        }));
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

  searchMovies(query: string): void {
    this.http.get<any>(`${this.apiUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query: query,
        language: 'en-US',
        page: '1'
      }
    }).subscribe({
      next: (res) => {
        let limitedMovies = res.results.slice(0, 6).map((m: any) => ({
          ...m,
          liked: this.likedMovies.some((lm: any) => lm.id === m.id)
        }));

        limitedMovies = limitedMovies.filter((m: any) =>
          m.title.toLowerCase().includes(query.toLowerCase())
        );

        this.movies.set(limitedMovies);

        this.totalPages = res.total_pages;
        this.currentPage = 1;
        this.updateVisiblePages();
      },
      error: (err) => console.error('Error searching movies:', err)
    });
  }
}
