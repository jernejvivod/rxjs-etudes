import {defer, EMPTY, empty, from, fromEvent, Observable, Observer, of} from "rxjs";
import {ajax} from "rxjs/internal/ajax/ajax";

// The 'of' operator creates an observable from a set of arguments.
import EventEmitter from "events";

export const simpleObservableFromOf$ = of(1, 2, 3);

// The 'from' operator creates an observable from an array-like argument of values.
export const simpleObservableFromFrom$ = from([1, 2, 3]);

export const simpleObservableFromCreate$ : Observable<number> = Observable.create((observer: Observer<number>) => {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
});

export const simpleObservableFromNew = new Observable((observer) => {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
})

export const observableWithDeferredDate$ = defer(() => of(new Date()));

export const emptyObservable$ = EMPTY;

export const eventEmitter = new EventEmitter();
export const eventObservable$ = fromEvent(eventEmitter, 'customEvent');

