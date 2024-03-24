import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isSearch : boolean = true;
  isBooking : boolean = false;

  constructor() { }





  ngOnInit(): void {
    console.log(window.location.pathname);
    let path = window.location.pathname;
    if(path == '/' || path == '/search'){
      this.isSearch = true;
      this.isBooking = false;
    }else{
      this.isSearch = false;
      this.isBooking = true;

    }
  }

  // changeStyle() : void{
  //   console.log(window.location.pathname);
  //   let path = window.location.pathname;
  //   if(path == '/' || path == '/search'){
  //     this.isSearch = true;
  //   }else{
  //     this.isSearch = false;
  //   }
  // }

  clickSearch(): void{
    this.isSearch = true;
    this.isBooking = false;
  }

  clickBooking(): void{
    this.isSearch = false;
    this.isBooking = true;
  }



}
