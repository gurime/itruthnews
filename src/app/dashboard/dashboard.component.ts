import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {



//top news route for dashboard
gotoapple(){
this.router.navigate(['/apple']); 
}
//top news route for dashboard


//headline routes for dashboard
gotosweat(){
    this.router.navigate(['/keithsweat']); 
}
gotojane(){
    this.router.navigate(['/jane']); 
}

gotocov(){
    this.router.navigate(['/cov']); 
}

gotoxi(){
    this.router.navigate(['/XI']); 
}

gotostock(){
    this.router.navigate(['/stock']); 
}
//headline routes for dashboard


//tech routes for dashboard
gotoflutter(){
    this.router.navigate(['/flutter']); 
}
gotoplaystation(){
    this.router.navigate(['/playstation']); 
}
gotoaws(){
    this.router.navigate(['/aws']); 
}
gotogoogle(){
    this.router.navigate(['/google']); 
}
gotomicrosoft(){
    this.router.navigate(['/microsoft']); 
}
//tech routes for dashboard

//politics routes for dashboard
gotoval(){
    this.router.navigate(['/putin']); 
}
gotobiden(){
    this.router.navigate(['/biden']); 
}
gotomitch(){
    this.router.navigate(['/Mitch']); 
}
gotofauc(){
    this.router.navigate(['/fauci']); 
}
gotomacor(){
    this.router.navigate(['/macor']); 
}
//politics routes for dashboard

//opinion routes for dashboard
gotovot(){
    this.router.navigate(['/vote']); 
}
gototrump(){
    this.router.navigate(['/trump']); 
}
gotodebt(){
    this.router.navigate(['/student-debt']); 
}
gototom(){
    this.router.navigate(['/tom-brady']); 
}
gotokat(){
    this.router.navigate(['/cathie-wood']); 
}
//opinion routes for dashboard

//music routes for dashboard
gotokel(){
    this.router.navigate(['/Rkelly']); 
}
gotowit(){
    this.router.navigate(['/Whitney-Houston']); 
}
gotomariah(){
    this.router.navigate(['/Mariah-Carey']); 
}
gotogerald(){
    this.router.navigate(['/Gerald-Levert']); 
}
gotomichael(){
    this.router.navigate(['/Michael-Jackson']); 
}
//music routes for dashboard

//sports routes for dashboard
gotojordan(){
    this.router.navigate(['/Michael-Jordan']); 
}
gotolebron(){
    this.router.navigate(['/Lebron-James']); 
}
gotocow(){
    this.router.navigate(['/Cowboys']); 
}
gotodwade(){
    this.router.navigate(['/Duane-Wade']); 
}
gotohoc(){
    this.router.navigate(['/Hockey']); 
}
//sports routes for dashboard















  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
