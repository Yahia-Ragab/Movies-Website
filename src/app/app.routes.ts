import { Routes } from '@angular/router';
import { Movies } from './movies/movies';
import { About } from './about/about';
import { WatchList } from './watch-list/watch-list';
import { Empty } from './empty/empty';
import { MovieDetails } from './movie-details/movie-details';

export const routes: Routes = [
    {path:'about',component:About},
    {path:'watchList',component:WatchList},
    {path:'movie-details/:id',component:MovieDetails},
    { path: 'movies', component: Movies },   
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
    {path:'',component:Movies},
    {path:'**',component:Empty}
];
