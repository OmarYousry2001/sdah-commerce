import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Category } from "./categoryComponent/category/category";
import { Header } from "./headerComponent/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Category, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('admin');
  showNav:boolean=false
  constructor(router:Router)
  {
    router.events.subscribe(event =>{
      if(event instanceof NavigationEnd)
      {

        this.showNav = !event.url.includes('/admin/login')
      }
    })
  }
}
