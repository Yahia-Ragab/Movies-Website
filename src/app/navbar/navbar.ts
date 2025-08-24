import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  searchQuery: string = '';

  @Output() search = new EventEmitter<string>();

  onSearch() {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery);
    }
  }
}
