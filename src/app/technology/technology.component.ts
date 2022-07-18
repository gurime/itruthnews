import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css']
})
export class TechnologyComponent implements OnInit {

//top news route for tech page
gotomac(){
this.router.navigate(['/Macbook'])
}

//headline news route for tech
gotometa(){
this.router.navigate(['/Metaverse'])
}
gotoblock(){
this.router.navigate(['/Blockchain'])
}
gotonintendo(){
this.router.navigate(['/Nintendo'])
}
gotowindows(){
this.router.navigate(['/Windows'])
}
gotoreact(){
this.router.navigate(['/React'])
}
//headline news route for tech


//opinion tech news routes for tech
gotozuck(){
  this.router.navigate(['/Zuckerberg'])
}
gotoamazonring(){
  this.router.navigate(['/Amazon-Ring'])
}
gototik(){
  this.router.navigate(['/TikTok'])
}
gototwitter(){
  this.router.navigate(['/Twitter'])
}
gotomusk(){
  this.router.navigate(['/Musk'])
}
//opinion tech news routes for tech

//gaming tech news routes for tech
gotohor(){
  this.router.navigate(['Horizon-Forbidden-West'])
}
gotofort(){
  this.router.navigate(['Fortnite'])
}
gotodoom(){
  this.router.navigate(['Doom'])
}
gotogears(){
  this.router.navigate(['Gears'])
}
gotogodofwar(){
  this.router.navigate(['God-of-War'])
}
//gaming tech news routes for tech


//PC news routes for tech
gotogpu(){
  this.router.navigate(['/GPUshort'])
}
gotopsu(){
  this.router.navigate(['/Powersupply'])
}
gotoryzen(){
  this.router.navigate(['/Ryzen'])
}
gotointelevo(){
  this.router.navigate(['/IntelEvo'])
}
gotorazer(){
  this.router.navigate(['/RazerRaptor'])
}
//PC news routes for tech


//web development routes for tewch
gotoangular(){
  this.router.navigate(['/Angular'])
}
gotovue(){
  this.router.navigate(['/Vue'])
}
gotopy(){
  this.router.navigate(['/Python'])
}
gotojav(){
  this.router.navigate(['/JAVA'])
}
gotoc(){
  this.router.navigate(['/C#'])
}
//web development routes for tech

//Ui/UX routes for tewch
gotofigma(){
  this.router.navigate(['/Figma'])
}
gotohtmll(){
  this.router.navigate(['/HTML'])
}
gotosket(){
  this.router.navigate(['/Sketch'])
}
gotoadxd(){
  this.router.navigate(['/AdobeXD'])
}
gotocss1(){
  this.router.navigate(['/CSS3'])
}
//Ui/UX routes for tech










  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
