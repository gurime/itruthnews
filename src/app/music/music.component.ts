import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {
  gotox(){
    this.router.navigate(['/DMX'])
  }


  
  goto50(){
    this.router.navigate(['/50'])
  }



  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
