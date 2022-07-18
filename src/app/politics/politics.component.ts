import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-politics',
  templateUrl: './politics.component.html',
  styleUrls: ['./politics.component.css']
})
export class PoliticsComponent implements OnInit {
//top news route for politics page
  gotoabort(){
    this.router.navigate(['/Abortion'])
  }
//top news route for politics page

//headline news route for politics
  gotobeut(){
    this.router.navigate(['/Politics'])
  }
  gotosup(){
    this.router.navigate(['/Supreme'])
  }
  gotopel(){
    this.router.navigate(['/Pelosi'])
  }
  gotoukr(){
    this.router.navigate(['/Ukrain'])
  }
  gotocan(){
    this.router.navigate(['/Canada'])
  }
//headline news route for politics



//opinion news route for politics

gotopol(){
  this.router.navigate(['/Opinion/Poland'])
}
gotouval(){
  this.router.navigate(['/Opinion/Texas'])
}
gotogas(){
  this.router.navigate(['/Opinion/Gas'])
}
gototrumpp(){
  this.router.navigate(['/Opinion/Trump'])
}
gotounrest(){
  this.router.navigate(['/Opinion/Kenya'])
}
//opinion news route for politics

//world news routes for politics
gotomex(){
  this.router.navigate(['/Cartel'])
}
gotoven(){
  this.router.navigate(['/Venezuala'])
}
gotobraz(){
  this.router.navigate(['/Brazil'])
}
gotouk(){
  this.router.navigate(['/London'])
}
gotoegy(){
  this.router.navigate(['/Egypt'])
}
//world news routes for politics















  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
