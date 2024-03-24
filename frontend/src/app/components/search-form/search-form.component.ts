import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { NgForm,FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter, catchError, throwError, pipe } from 'rxjs';
import { ThisReceiver } from '@angular/compiler';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

  // Const Varaible
  IP_TOKEN : string = 'a3754846bd9a68'
  IP_HOST : string = 'https://ipinfo.io/json'
  HOST : string = 'https://kiarahw8.wl.r.appspot.com'
  // HOST : string = 'http://localhost:8888'

  // *ngIf varaible: Control the elements' display status
  hasResult : boolean = false;
  noResult : boolean = false;
  displayDetail : boolean = false;
  hasReserve : boolean = false;

  // Autocomplete varaibles
  autoText: any = [];
  isLoading = false;
  errorMsg!: string;


  // results
  // Search Result
  categoryList= [
    {
      label : "Default",
      value: "all",
    },
    {
      label: "Arts & Entertainment",
      value: "arts",
    },
    {
      label: "Health & Medical",
      value: "health",
    },
    {
      label: "Hotels & Travel",
      value: "hotelstravel",
    },
    {
      label: "Food",
      value: "food",
    },
    {
      label: "Professional Services",
      value: "professional",
    }


  ];
  formInfo : any = {
    keyword: '',
    distance: '',
    category: 'all',
    autoDetect : false,
    location : '',
  };
  searchResult : any = [];
  displayedColumns: string[] = ['index', 'img', 'name', 'rating', 'distance'];
  dataSource = this.searchResult;


  //Detail Results
  detailInfo : any = {};
  reviews : any = []
  isOpen : boolean = true;
  detailCat : any = [];

  //Reservation Results
  reserveInfo : any = {
    email : "",
    date : "",
    hour : "",
    min : "",
    name : this.detailInfo.name,
    id : this.detailInfo.id
  }
  bookArr = [];
  date : Date = new Date()
  
  // Google Map
  mapOptions: google.maps.MapOptions = {
    center: { lat:37.80587, lng:-122.42058 }
  }
  marker = {
      position: { lat: 37.80587, lng: -122.42058 },
  }
  showMap : boolean = false;

  // Form Control
  locCtrl : FormControl = new FormControl({
    value: this.formInfo.loccation,
    disabled : false
  });
  disCtrl : FormControl = new FormControl({
    value: this.formInfo.distance
  })
  keywordCtrl = new FormControl();
  reserveForm = new FormGroup({
    email: new FormControl(this.reserveInfo.email, 
      [
        Validators.required,
      ]
    ),
    date: new FormControl(this.reserveInfo.date,
      [
        Validators.required,
      ]
    ),
    hour: new FormControl(this.reserveInfo.hour, 
      [
        Validators.required
      ]
      ),
    min: new FormControl(this.reserveInfo.min, 
      [
        Validators.required
      ]),
  });



  // not used
  // locDisable : boolean = false;
  // gmap = document.getElementById("gmap");


  constructor(private http : HttpClient, 
    private modalService: NgbModal,
    public activeModal : NgbActiveModal,
    // public modalRef : NgbModalRef,
    public modalActive : NgbActiveModal
    ) { 
  }

  today : string = "";
  
  ngOnInit(): void {

    // set input type=date min=today
    let date = new Date();
    this.today = [
      date.getFullYear(),
      ('00' + (date.getMonth() + 1)).slice(-2),
      ('00' + date.getDate()).slice(-2)
    ].join('-');
    
    

    //Autocomplete
    //reference : https://www.freakyjolly.com/mat-autocomplete-with-http-api-remote-search-results/
    this.keywordCtrl.valueChanges
      .pipe(
        filter((res: string | null)  => {
          return res !== null && res != "";
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.isLoading = true;
        }),
        switchMap((value: any) => this.http.get(this.HOST + '/getAutoComplete', {params : {'text' : value}})
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((res: any) => {
        this.autoText = [];
        let data = res.data;
        if (data.categories.length == 0 && data.terms.length == 0) {
          this.errorMsg = "No result";
          this.autoText = [];
        } else {
          this.errorMsg = "";
          for(let i = 0; i<data.categories.length; i++){
            this.autoText.push({"title":data.categories[i].title});
          }
          for(let i = 0; i<data.terms.length; i++){
            this.autoText.push({"title":data.terms[i].text});
          }
        }
      });


    
  }


  /*
    Auto Complete Functions
  */
  // reference : https://www.freakyjolly.com/mat-autocomplete-with-http-api-remote-search-results/

  displayWith(value: any) {
    return value;
  }


  /*
    Search Form Functions
  */
  // 1.choose ipinfo or geo
  submitForm(): void{

    // test
    // console.log(this.formInfo);
    this.formInfo.distance = this.formInfo.distance == "" ? 10 : this.formInfo.distance;


    // TODO: detect form info

    let auto = this.formInfo.autoDetect;

    if(auto){ // need to use IPINFO API
      let param = {
        'token' : this.IP_TOKEN
      }
      this.http.get(this.IP_HOST, {params: param}).subscribe((res :any) => {
        // console.log(res);
        // res = res.loc;
        let data = res.loc.split(',');
        let location = {
            lat : data[0],
            lng : data[1]
        };
        this.getResult(location);

      });


    }else{ // need to use GeoCoding Api(through backend)
      let param = {
        'location' : this.formInfo.location,
      }
      this.http.get(this.HOST + '/getGeo', {params : param}).subscribe((res : any) => {
        // console.log(res);
        let data = res.data;

        if(data.status == "[ZERO_RESULTS]"){
          this.showNoResult();
          return
        }
        let location = data.results[0].geometry.location;
        // console.log(location);
        this.getResult(location);

      })
    }


  }

  // 2.submit
  getResult(location : any) : void{

    // console.log(location);

    let formData : any = {
      keyword: this.formInfo.keyword,
      distance: this.formInfo.distance,
      category: this.formInfo.category,
      lat : location.lat,
      lng : location.lng,
    }

    //TODO: use backend Api to ge result
    this.http.get(this.HOST + '/getResult', {params: formData}).pipe(
      catchError(error => {
        this.showNoResult()
        console.log(error)
        return throwError('error')
      })
    ).subscribe((res :any) => {
      console.log(res);
      // this.searchResult = res;

      this.createTable(res);

    })
    
    // ,error => {
    //   this.showNoResult()
    //   console.log(error)
    // })
    
  }

  // 3.create the table
  createTable(res: any) : void{
    // console.log( this.searchResult);
    if(res.data.total == 0){
      this.showNoResult();

    }else{
      this.searchResult = res.data.businesses;

      this.hasResult = true;
      this.noResult = false;
      this.displayDetail = false;
      this.showMap = false;
    }
  }

  // Form operations
  // change the input if the checkbox is checked
  autoCheck() : void{
    if(this.formInfo.autoDetect){
      this.formInfo.location = "";
      this.locCtrl.disable();
    }else{
      this.locCtrl.enable();
    }
  }

  // clear form
  clearForm() : void{
    this.formInfo = {
      keyword: '',
      distance: '',
      category: 'all',
      autoDetect : false,
      location : '',
    };
    this.locCtrl.enable();
    this.hasResult = false;
    this.noResult = false;
    this.displayDetail = false;
    this.showMap = false;


  }

  // no result
  showNoResult() : void {
    this.hasResult = false;
    this.noResult = true;
    this.displayDetail = false;
    this.showMap = false;
  }

  /*
    Detail Card
  */
  // show detail
  showDetail(data : any) : void{

    this.showMap = false;
    this.hasReserve = false;

    let id = data.data.id;
    let param = {
      "id": id,
    }
    this.http.get(this.HOST + '/getBusiness', {params: param}).subscribe((res :any) => {
      // console.log(res.data)
      this.displayDetail = true;
      this.hasResult = false;
      this.detailInfo = res.data;
      this.isOpen = this.detailInfo.hours != undefined ? this.detailInfo.hours[0].is_open_now : false;
      this.detailCat = [];
      for(let obj of this.detailInfo.categories){
        this.detailCat.push(obj.title)
      }

      // set google map
      let obj : any = {
        "lat" : this.detailInfo.coordinates.latitude,
        "lng" : this.detailInfo.coordinates.longitude
      }
      this.mapOptions.center = obj;
      this.marker.position = obj;
      this.showMap = true;

      let bookInfo : any = localStorage.getItem('bookingsllei8880');
      if(bookInfo != null){
        bookInfo = JSON.parse(bookInfo);
        this.bookArr = bookInfo;
        for(let i = 0; i < bookInfo.length; i++){
          if(bookInfo[i].id == this.detailInfo.id){
            this.hasReserve = true;
          }
        }
      }

      // get reviews result
      this.getReview(param);
    });

    

  }

  getReview(param : any) : void{
    // console.log("show review");
    this.http.get(this.HOST + '/getReview', {params : param}).subscribe((res :any) => {
      // console.log(res);
      // this.searchResult = res;
      this.reviews = res.data.reviews;
    });
  }

  // open model
	open(content : any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,backdrop : 'static'})
	}



  changeFormat() : void{
    let format = this.reserveInfo.time.split('/');
    let ans = format[1]+'/'+format[2]+'/'+format[0]
    this.reserveInfo.time = ans
  }
  
  backToList() : void{
    this.hasResult = true;
    this.displayDetail = false;
    this.showMap = false;
  }


  book(reserveForm : NgForm ) : boolean {
    if( !reserveForm.valid) return false
    console.log(this.reserveInfo);
    this.reserveInfo.name = this.detailInfo.name;
    this.reserveInfo.id = this.detailInfo.id;
    let param = this.reserveInfo;
    let obj : any = localStorage.getItem('bookingsllei8880');
    if(obj == null || JSON.parse(obj).length == 0){
      let arr = [];
      arr.push(param)
      localStorage.setItem('bookingsllei8880', JSON.stringify(arr));
    }else{
      let arr = JSON.parse(obj);
      console.log(arr);

      arr.push(param);
      localStorage.setItem('bookingsllei8880', JSON.stringify(arr));
      
    }

    window.alert("Reservation created!")
    this.hasReserve = true;
    // this.modalService.dismissAll();
    // this.modalRef.close()

    this.clearReserForm();
    return true

  }

  delete() : void {
    // console.log(data)
   
    let res = this.bookArr.filter((element : any) => {
      
      return element.id != this.detailInfo.id;
    })

    localStorage.setItem('bookingsllei8880',JSON.stringify(res));
    window.alert('Reservation cancelled!');
    this.hasReserve = false;
  }

  clearReserForm() : void{
    this.reserveInfo = {
      email : "",
      date : "",
      hour : "",
      min : "",
      name : this.detailInfo.name,
      id : this.detailInfo.id
    }
  }


  


}
