import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {


  gotogaming(){
    this.router.navigate(['/gaming'])
  }
  gotoContribute(){
    this.router.navigate(['/contribute']); 
}

  gotoContact(){
    this.router.navigate(['/contact']); 
}
gotoAdvertise(){
  this.router.navigate(['/advertise']);
}
gotoTerms(){
  this.router.navigate(['/terms-of-use']);
}
gotoPrivacy(){
  this.router.navigate(['/privacy']);
}
gotoCookie(){
  this.router.navigate(['/cookie']);
}
gotoFeedback(){
  this.router.navigate(['/feedback']);
}
gotoCareer(){
  this.router.navigate(['/career']);
}


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
