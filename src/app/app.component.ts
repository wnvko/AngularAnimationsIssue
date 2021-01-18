import { animate, animation, AnimationBuilder, AnimationMetadata, AnimationReferenceMetadata, style } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public hasStartedInitial = false;
  public hasStartedAfterCallToPlay = false;
  public hasStartedOnAnimationEnd = false;
  public hasStartedAfterCallToReset = false;

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
      this.overlay.nativeElement.focus();
      if (player) {
        this.hasStartedOnAnimationEnd = player.hasStarted();
        player.reset();
        this.hasStartedAfterCallToReset = player.hasStarted();
        player = null;
      }
    });
    player.play();
    this.hasStartedAfterCallToPlay = player.hasStarted();
  }

  ngOnInit(): void {
    fromEvent(this.overlay.nativeElement, 'keydown').pipe(
      filter((ev: KeyboardEvent) => ev.key === 'Escape' || ev.key === 'Esc')
    ).subscribe(() => {
      this.animate();
    });

    this.overlay.nativeElement.focus();
  }
}
