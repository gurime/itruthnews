import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css']
})
export class SportsComponent implements OnInit {
  gotodeo(){
    this.router.navigate(['/Deion'])
  }

  //headline news sports routes
  gotopj(){
    this.router.navigate(['/PJ'])
  }
  //headline news sports routes


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
