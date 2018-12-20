import { NgModule } from '@angular/core';
import { PairPageModule } from './pair/pair.module';
import { TabsPageModule } from './tabs/tabs.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'pair', component: PairPageModule },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: '', redirectTo: 'pair', pathMatch: 'full' }
];

@NgModule({
  imports: [
    PairPageModule,
    TabsPageModule, 
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
