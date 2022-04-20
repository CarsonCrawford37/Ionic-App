import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  AfterViewChecked, AfterViewInit
} from '@angular/core';


@Component({
  selector: 'app-tinder-ui',
  templateUrl: 'tinder-ui.component.html',
  styleUrls: ['tinder-ui.component.scss'],
})
export class TinderUIComponent implements AfterViewInit{

  @Input() restaurants = [];

  @Output() choiceMade = new EventEmitter();

  @ViewChildren('tinderCard') tinderCards: QueryList<ElementRef>;

  tinderCardsArray: Array<ElementRef>;

  moveOutWidth: number; // value in pixels that a card needs to travel to dissapear from screen
  shiftRequired: boolean; // state variable that indicates we need to remove the top card of the stack
  transitionInProgress: boolean; // state variable that indicates currently there is transition on-going
  heartVisible: boolean;
  crossVisible: boolean;

  constructor(private renderer: Renderer2) {
  }

  handlePan(event) {

    if (event.deltaX === 0 || (event.center.x === 0 && event.center.y === 0) || !this.restaurants.length) {return;}

    if (this.transitionInProgress) {
      this.handleShift();
    }

    this.renderer.addClass(this.tinderCardsArray[0].nativeElement, 'moving');

    if (event.deltaX > 0) { this.toggleChoiceIndicator(false,true); }
    if (event.deltaX < 0) { this.toggleChoiceIndicator(true,false); }

    const xMulti = event.deltaX * 0.03;
    const yMulti = event.deltaY / 80;
    const rotate = xMulti * yMulti;

    this.renderer.setStyle(
        this.tinderCardsArray[0].nativeElement,
        'transform',
        'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)'
    );

    // this.shiftRequired = true;

  };

  handlePanEnd(event) {

    this.toggleChoiceIndicator(false,false);

    if (!this.restaurants.length) {return;}

    this.renderer.removeClass(this.tinderCardsArray[0].nativeElement, 'moving');

    const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
    if (keep) {

      this.renderer.setStyle(this.tinderCardsArray[0].nativeElement, 'transform', '');
      this.shiftRequired = false;

    } else {

      const endX = Math.max(Math.abs(event.velocityX) * this.moveOutWidth, this.moveOutWidth);
      const toX = event.deltaX > 0 ? endX : -endX;
      const endY = Math.abs(event.velocityY) * this.moveOutWidth;
      const toY = event.deltaY > 0 ? endY : -endY;
      const xMulti = event.deltaX * 0.03;
      const yMulti = event.deltaY / 80;
      const rotate = xMulti * yMulti;

      this.renderer.setStyle(
          this.tinderCardsArray[0].nativeElement,
          'transform',
          'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)'
      );

      this.shiftRequired = true;

      this.emitChoice((event.deltaX > 0), this.restaurants[0]);
    }
    this.transitionInProgress = true;
  };

  userClickedButton(event, heart) {
    event.preventDefault();
    if (!this.restaurants.length) {return false;}
    if (heart) {
      this.tinderCardsArray[0].nativeElement.style.transform = 'translate(' + this.moveOutWidth + 'px, -100px) rotate(-30deg)';
      this.toggleChoiceIndicator(false, true);
    } else {
      this.tinderCardsArray[0].nativeElement.style.transform = 'translate(-' + this.moveOutWidth + 'px, -100px) rotate(30deg)';
      this.toggleChoiceIndicator(true, false);
    };
    this.emitChoice(heart, this.restaurants[0]);
    this.shiftRequired = true;
    this.transitionInProgress = true;
  };

  toggleChoiceIndicator(cross, heart) {
    this.crossVisible = cross;
    this.heartVisible = heart;
  };

  handleShift() {
    // console.log('hi');
    this.transitionInProgress = false;
    this.toggleChoiceIndicator(false, false);
    if (this.shiftRequired) {
      this.shiftRequired = false;
      this.restaurants.shift();
    }
  };

  emitChoice(heart, card) {
    this.choiceMade.emit({
      choice: heart,
      restaurant: card,
      cardsLeft: this.restaurants.length-1
    });
  };

  ngAfterViewInit() {
    this.moveOutWidth = document.documentElement.clientWidth * 1.5;
    this.tinderCardsArray = this.tinderCards.toArray();
    this.tinderCards.changes.subscribe(() => {
      this.tinderCardsArray = this.tinderCards.toArray();
    });
  };

}