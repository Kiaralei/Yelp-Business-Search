import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  constructor() { }

  hasBooking : boolean = false;
  bookArr : any = []


  ngOnInit(): void {

    let obj : any = localStorage.getItem('bookingsllei8880');
    if(obj == null || JSON.parse(obj).length == 0){
      this.hasBooking = false;
    }else{
      this.hasBooking = true;
    }


    // tranverse localStorage
    if(this.hasBooking){
      this.bookArr = JSON.parse(obj);
      console.log(this.bookArr)
    }

  }

  delete(data : any) : void {
    console.log(data)
   
    let res = this.bookArr.filter((element : any) => {
      
      return element.id != data.data.id;
    })
    console.log(res);
    localStorage.setItem('bookingsllei8880',JSON.stringify(res));
    window.alert('Reservation cancelled!');
    this.renderTable();
  }

  renderTable() : void{
    let obj : any = localStorage.getItem('bookingsllei8880');
    if(obj == null || JSON.parse(obj).length == 0){
      this.hasBooking = false;
    }else{
      this.hasBooking = true;
    }


    // tranverse localStorage
    if(this.hasBooking){
      this.bookArr = JSON.parse(obj);
      console.log(this.bookArr)
    }
  }




}
