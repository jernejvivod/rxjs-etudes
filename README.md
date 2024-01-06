# RxJS Notes

## Observable

Observables are lazy Push collections of multiple values. They fill the missing spot in the following table:

|          | **Single**         | **Multiple**          |
|----------|--------------------|-----------------------|
| **Pull** | Function           | `Iterator` (ES2015)   |
| **Push** | `Promise` (ES2015) | `Observable` (ES2015) |

Pull vs Push are two different protocols that describe how a data producer can communicate with a data consumer.

### Pull

In Pull systems, the consumer determines when it receives data from the data producer.
The producer itself is unaware of when the data will be delivered to the consumer.

### Push

In push systems, the producer determines when to send data to the consumer. The consumer is
unaware of when it will receive the data.

Promises are the most common type of push system in JavaScript. The promise is
in charge of determining precisely when the value is "pushed" to the callbacks.

An Observable is a lazily evaluated computation that can synchronously or asynchronously
return zero to infinite values from the time it's invoked onwards.

### Observables as generalizations of functions

Observables are not like EventEmitters nor are they like Promises for multiple values.

Observables may act like EventEmitters when they are multicasted using RxJS Subjects.

Observables have no shared execution and are lazy.

Observables are not asynchronous.

The main difference between functions and Observables is that Observables can "return" multiple values over time.

Conclusion:
- `func.call()` means "give me one value synchronously"
- `observable.subscribe()` means "give me any amount of values, either synchronously or asynchronously".


### Core Observable Concerns

Core observable concerns are:
- Creating observables
- Subscribing to observables
- Executing the observable
- Disposing observable executions

### Creating Observables

The `Observable` constructor takes one argument: the `subscribe` function.

The following example creates an Observable to emit the String `hi` every second to a subscriber.

```TypeScript
import { Observable } from 'rxjs';

const observable = new Observable((subscriber) => {
    const id = setInterval(() => {
       subscriber.next('hi');
    }, 1000)
})
```

### Subscribing to Observables

The Observable `observable` in the previous example can be subscribed to, like this:

```TypeScript
observable.subscribe((x) => console.log(x));
```

Notice how each call to `observable.subscribe` triggers its own independent setup for that given subscriber.

With `observable.subscribe`, the given Observer is not registered as a listener in the Observable.
The Observable does not maintain a list of attached Observers.

A `subscribe` call is simply a way to start an "Observable execution" and deliver values or events to an Observer of that execution.

### Executing the Observable

There are three types of values an Observable Execution can deliver:
- "Next" notification: sends a value,
- "Error" notification: sends a JavaScript `Error` or exception,
- "Complete" notification: does not send a value.

These constraints are expressed in the Observable grammar or contract written as a regular expression:
```
next*(error|complete)?
```

### Disposing Observable Executions

Because Observable executions may be infinite, and it's common for an Observer to want to abort execution in finite time,
we need an API for canceling an execution.
Since each execution is exclusive to one Observer only, once the Observer is done receiving values,
it has to have a way to stop the execution, in order to avoid wasting computation power or memory resources.

When observable.subscribe is called, the Observer gets attached to the newly created Observable execution.
This call returns the `Subscription` object.

```TypeScript
const subscription = observable.subscribe(x);
```

The Subscription represents the ongoing execution,
and has a minimal API which allows you to cancel that execution using `subscription.unsubscribe()`.

Each Observable must define how to dispose resources of that execution when we create the Observable.

Example:
```TypeScript
import { Observable } from 'rxjs';

const observable = new Observable(function subscribe(subscriber) {
  // Keep track of the interval resource
  const intervalId = setInterval(() => {
    subscriber.next('hi');
  }, 1000);

  // Provide a way of canceling and disposing the interval resource
  return function unsubscribe() {
    clearInterval(intervalId);
  };
});
```

## Observer

An Observer is a consumer of values delivered by an Observable. Observers are simply a set of callbacks,
one for each type of notification delivered by the Observable: next, error, and complete.

The following is an example of a typical Observer object:
```TypeScript
const observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
```

To use the Observer, provide it to the subscribe of an Observable:
```TypeScript
observable.subscribe(observer);
```

Observers are just objects with three callbacks, one for each type of notification that an Observable may deliver.

Observers in RxJS may also be partial.
If you don't provide one of the callbacks, the execution of the Observable will still happen normally,
except some types of notifications will be ignored, because they don't have a corresponding callback in the Observer.

When subscribing to an Observable, you may also just provide the next callback as an argument:
```TypeScript
observable.subscribe(x => console.log('Observer got a next value: ' + x));
```
