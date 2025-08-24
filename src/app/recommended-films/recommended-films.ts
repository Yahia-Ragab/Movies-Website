import { Component, OnInit, Input,signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recommended-films',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './recommended-films.html',
  styleUrl: './recommended-films.css'
})
export class RecommendedFilms implements OnInit {
  @Input() movieId: string | null = null;
  films = signal<any[]>([]);
  isLoading = true;
  chunkedFilms = signal<any[][]>([]);

  
  private apiKey = '072e8885c0871676d8eadaee59eb40ec';
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (this.movieId) {
      this.loadRecommendedMovies(this.movieId);
    }
  }
  loadRecommendedMovies(id: string): void {
    this.http.get<any>(`${this.apiUrl}/movie/${id}/recommendations`, {
      params: { api_key: this.apiKey, language: 'en-US' }
    }).subscribe({
      next: (res) => {
        this.films.set(res.results);
        this.chunkedFilms.set(this.groupArray(res.results, 4)); 
      },
      error: (err) => console.error('Failed to load recommended movies', err)
    });
  }
  

  private groupArray(arr: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

}



