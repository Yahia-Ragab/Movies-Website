import { Routes } from '@angular/router';
import { Movies } from './movies/movies';
import { About } from './about/about';
import { WatchList } from './watch-list/watch-list';
import { Empty } from './empty/empty';

export const routes: Routes = [
    {path:'about',component:About},
    {path:'watchList',component:WatchList},
    {path:'',component:Movies},
    {path:'**',component:Empty}
];
