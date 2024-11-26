import { Routes } from '@angular/router';
import { AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path:'',
    loadComponent:()=>import('./components/landing-page/landing-page.component').then(m=>m.LandingPageComponent)
  },
  {
    path:'home',
    loadComponent:()=>import('./components/home/home.component').then(m=>m.HomeComponent),
    canActivate:[AuthGuard]
  },
  {
    path:'ranking',
    loadComponent:()=>import('./components/ranking/ranking.component').then(m=>m.RankingComponent)
  },
  {
    path:'game',
    loadComponent:()=>import('./components/game/game.component').then(m=>m.GameComponent),
    canActivate:[AuthGuard]
  },
  {
    path:'account/:name',
    loadComponent:()=>import('./components/account/account.component').then(m=>m.AccountComponent),
    canActivate:[AuthGuard]
  },
  {
    path:'login',
    loadComponent:()=>import('./components/login/login.component').then(m=>m.LoginComponent)
  },
  {
    path:'register',
    loadComponent:()=>import('./components/register/register.component').then(m=>m.RegisterComponent)
  }
  ,{
  path:'lobby',
    loadComponent:()=>import('./components/game-lobby/game-lobby.component').then(m=>m.GameLobbyComponent)
  }
  ,{
  path:'playing',
    loadComponent:()=>import('./components/game-playing/game-playing.component').then(m=>m.GamePlayingComponent)
  },
  {
    path:'result',
    loadComponent:()=>import('./components/result/result.component').then(m=>m.ResultComponent)
  }

];
