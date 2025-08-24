import { Component, OnInit, signal } from '@angular/core';
import { NgFor, NgIf, DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, NgClass, RouterLink],
  templateUrl: './watch-list.html',
  styleUrls: ['./watch-list.css']
})
export class WatchList implements OnInit {
  likedMovies: any[] = [];
  genresMap = new Map<number, string>();

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      this.likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
      this.likedMovies.forEach(m => m.liked = true); // mark all as liked
    }

    // Load genres from TMDB API if needed
    // Optionally hardcode the popular genres map here
    this.genresMap = new Map([
      [28, 'Action'], [12, 'Adventure'], [16, 'Animation'], [35, 'Comedy'],
      [80, 'Crime'], [99, 'Documentary'], [18, 'Drama'], [10751, 'Family'],
      [14, 'Fantasy'], [36, 'History'], [27, 'Horror'], [10402, 'Music'],
      [9648, 'Mystery'], [10749, 'Romance'], [878, 'Science Fiction'],
      [10770, 'TV Movie'], [53, 'Thriller'], [10752, 'War'], [37, 'Western']
    ]);
  }

  toggleLike(movie: any): void {
    movie.liked = !movie.liked;

    if (!movie.liked) {
      this.likedMovies = this.likedMovies.filter(m => m.id !== movie.id);
    }

    localStorage.setItem('likedMovies', JSON.stringify(this.likedMovies));
  }

  removeMovie(id: number): void {
    this.likedMovies = this.likedMovies.filter(m => m.id !== id);
    localStorage.setItem('likedMovies', JSON.stringify(this.likedMovies));
  }

  getGenresForMovie(genreIds: number[]): string {
    return genreIds
      .map(id => this.genresMap.get(id))
      .filter(Boolean)
      .join(', ');
  }
}
