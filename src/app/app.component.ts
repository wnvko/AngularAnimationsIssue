import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AnimationBuilder, AnimationReferenceMetadata, AnimationMetadata, style, animate, animation } from '@angular/animations';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private builder: AnimationBuilder) { }

  @ViewChild('overlay', { static: true })
  private overlay: ElementRef;

  @ViewChild('content', { static: true })
  private content: ElementRef;

  animation: AnimationMetadata[] = [
    style({
      transform: `translateY(-500px)`
    }),
    animate(
      `1000ms`,
      style({
        transform: `translateY(0)`
      })
    )
  ];

  baseParams = {
    duration: '350ms',
    fromPosition: 'translateY(-500px)',
    toPosition: 'translateY(0)'
  };

  animate(): void {
    const fadeIn: AnimationReferenceMetadata = animation(this.animation);
    const builder = this.builder.build(fadeIn);
    let player = builder.create(this.content.nativeElement);
    player.onDone(() => {
      if (player) {
        player.reset();
        player = null;
      }
    });
    player.play();
  }

  ngOnInit(): void {
    fromEvent(this.overlay.nativeElement, 'keydown').pipe(
      filter((ev: KeyboardEvent) => ev.key === 'Escape' || ev.key === 'Esc')
    ).subscribe(() => {
      this.animate();
    });
  }
}
