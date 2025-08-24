import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Movies } from './movies/movies'; 
import {Navbar} from './navbar/navbar';
import {Footer} from './footer/footer';
import { About } from './about/about';
import {Empty} from './empty/empty';
import {WatchList} from './watch-list/watch-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('iti');

  constructor(private router: Router) {}

  onSearch(query: string) {
    if (query.trim()) {
      this.router.navigate(['/movies'], { queryParams: { q: query } });
    }
  }
}