import {
    emptyObservable$, eventEmitter, eventObservable$,
    observableWithDeferredDate$,
    simpleObservableFromCreate$,
    simpleObservableFromFrom$,
    simpleObservableFromOf$,
} from "../src/creation-operators/creation-operators";
import {fromEventPattern} from "rxjs";


test('simple observable created using of should emit specified values', (done) => {
    let arr: number[] = [];
    simpleObservableFromOf$.subscribe({
        next: (val) => arr.push(val),
        error: (error) => done.fail(error),
        complete: () => {
            expect(arr).toEqual([1, 2, 3]);
            done()
        }
    });
});

test('simple observable created using from should emit specified values', (done) => {
    let arr: number[] = [];
    simpleObservableFromFrom$.subscribe({
        next: (val) => arr.push(val),
        error: (error) => done.fail(error),
        complete: () => {
            expect(arr).toEqual([1, 2, 3]);
            done()
        }
    });
});

test('simple observable created using create should emit specified values', (done) => {
    let arr: number[] = [];
    simpleObservableFromCreate$.subscribe({
        next: (val) => arr.push(val),
        error: (error) => done.fail(error),
        complete: () => {
            expect(arr).toEqual([1, 2, 3]);
            done()
        }
    });
});

test('simple observable created using new should emit specified values', (done) => {
    let arr: number[] = [];
    simpleObservableFromCreate$.subscribe({
        next: (val) => arr.push(val),
        error: (error) => done.fail(error),
        complete: () => {
            expect(arr).toEqual([1, 2, 3]);
            done()
        }
    });
});

test('deferred observable should emit a date that is initialized at the time of subscription', (done) => {
    let date1: Date;
    let date2: Date;
    observableWithDeferredDate$.subscribe({
        next: (date) => {
            date1 = date;
        },
        error: (error) => done.fail(error),
        complete: () => {
            setTimeout(() => {
                observableWithDeferredDate$.subscribe({
                    next: (date) => {
                        date2 = date;
                    },
                    error: (error) => done.fail(error),
                    complete: () => {
                        expect(date2.getTime() - date1.getTime()).toBeGreaterThan(1000);
                        done()
                    }
                });
            }, 2000);
        }
    });
});

test('empty observable should complete immediately', (done) => {
    emptyObservable$.subscribe({
        next: (_) => {
            done.fail('should not emit any values');
        },
        complete: () => {
            done()
        }
    });
});


test('Event observable should emit values when event is emitted', (done) => {
    let arr: number[] = [];
    const subs = eventObservable$.subscribe((val) => arr.push(val as number));
    eventEmitter.emit('customEvent', 1);
    eventEmitter.emit('customEvent', 2);
    eventEmitter.emit('customEvent', 3);

    setTimeout(() => {
        expect(arr).toEqual([1, 2, 3]);
        done()
    }, 500);
});
