# most comfort way to handle schedule issue in react hooks

> Support vite, cra, typescript
> Fully eslint support

```typescript
const startedRef = useStartedRef();
useEffect(() => {
  if (startedRef.current) {
    // ignore the initialization of a
    // which means the value in useState(()=>xxx) will be ignored
  }
}, [a]);

const endRef = useEndRef();
useEffect(() => {
  const timeout = setTimeout(() => {
    if (endRef.current) {
      // no need to use return callback
      clearTimeout(timeout);
    }
  }, 1000);
}, []);

const aRef = useStateRef(a);

useEffect(() => {
  someCb(aRef.current);
  // a's change will not take effect(call the someCb)
}, [aRef, someCb]);

const aPreviousRef = usePreviousRef(a);
useEffect(() => {
  if (aPreviousRef.current !== a) {
    // only call when a change
    someCb(a);
  }
}, [a, aPreviousRef, someCb]);

// params are dependency list, history array length
const aHistoryRef = useHistoryRef([a], 3);
useEffect(() => {
  const his = aHistoryRef.current;
  if (his[0].join(",") === "3,2,1") {
    // only call when a's change history is 3,2,1
    someCb();
  }
}, [a, aHistoryRef, someCb]);

// transform ref a to state (scheduled by a)
const historyState = useStateFromRef(aHistoryRef, [a]);

const aTimeRef = useEffectTimeRef([a]);
useEffect(() => {
  if (aTimeRef.current.getTime() < new Date("2020-06-02 22:32:11").getTime()) {
    // only call in certain time period
    someCb();
  }
}, [a, aTimeRef, someCb]);

// emit time every 1000ms
const timer = useTimer(1000);
const previousTimerRef = usePreviousRef(timer);
useEffect(() => {
  if (timer !== previousTimerRef.current) {
    // call every 1000ms
    someCb();
  }
}, [timer, aTimeRef, someCb]);
```

## Introduction

Hooks-Schedule is a brand new tool, that makes you handle problems of scheduling in React more efficiently.

With a few APIs, it will accelerate your coding speed, with no concern about dependencies, and let the ESLint hooks rules take effect.

Scheduling problems usually arise not just in rare incidents, but also in some general business coding.

```typescript
const businessCb = useCallback(() => {
  // a,b,c,d,e involved
}, [a, b, c, d, e]);
```

Because we habitually let the callback handle logic code but want the React to schedule the logic, make it take effect just after some data change.

```typescript
useEffect(() => {
  businessCb();
}, [a]);
```

There is a problem - we set the dependencies to [a], which means we want the callback run after 'a' take effect(changed), but when we do this, 'businessCb' cannot get the right(and newest)state of 'b,c,d,e'.

So we add 'b,c,d,e' into the dependency list.

```typescript
useEffect(() => {
  businessCb();
}, [a, b, c, d, e]);
```

Or as we all know, useCallback is just a sugar of useMemo but returns a callback, so -

```typescript
useEffect(() => {
  businessCb();
}, [a, businessCb]);
```

(eslint-plugin-react-hooks will help you set the right dependency list)

But the meaning of that effect callback changed - not just the change of 'a' will let the callback called, but also the 'b,c,d,e' will lead to the same result.

We may want to and some conditional judgement in useEffect.

```typescript
useEffect(()=>{
  if(a has changed){
    // only call when a changed(take effect)
    businessCb()
  }
},[a,businessCb])
```

This is a scheduling problem, you can use a ref value to handle, or just use useReducer.

But ref type of usage is too tedious, so is useReducer. and with useReducer, you cannot take advantage of third party's hooks tools.

This is why we made this tool, just aim at schedule problems, and in friendly use.

## Ref apis

all the ref apis must be used like this below:

```typescript
const someRef = useSomeRef(xxx, [deps]);
useEffect(() => {
  // all of them are ref
  if (xxx.current !== dep) {
    // ... take control of schedule
  }
}, [dep, xxx]);
// useCallback,useMemo are in the same use
```

### useStartedRef

Known if state is initialized

```typescript
const started = useStartedRef();
useEffect(() => {
  if (started.current) {
    // only run while aStarted current value is true
    // ignore initialization
  }
}, [a, b, c, started]);
```

### useEndRef

Known if current scope destroyed

```typescript
const endRef = useEndRef();
useEffect(() => {
  // some async handler
  xxx(() => {
    if (endRef.current) {
      // handle clear
    }
  });
}, []);
```

### useStateRef

Make a state, memorized value, callback into a ref

```typescript
const aRef = useStateRef(a);

const m = useMemo(() => !!a, [a]);
const mRef = useStateRef(m);

const c = useCallback(() => {}, [a, b, c]);
const cRef = useStateRef(c);
```

### usePreviousRef

Get the previous value of certain state

```typescript
const aRef = usePreviousRef(a);

useEffect(() => {
  if (aRef.current !== a) {
    // only when a changed
  } else {
    // when a not change
  }
}, [a, b, c, d, e]);
```

### useHistoryRef

get mutations history of certain dependencies schedule

```typescript
// default to length with 3
const [a, setA] = useState(0);
const [B, setB] = useState(0);
const simpleHistoryRef = useHistoryRef([a]);
const historyRef = useHistoryRef([a, b], 4);
useEffect(() => {
  console.log(simpleHistoryRef.current);
  // [[0],[undefined],[undefined]]
  // [[1],[0],[undefined]]
  // [[2],[1],[0]]
  // [[3],[2],[1]]
  console.log(historyRef.current);
  // [[0,0],[undefined,undefined],[undefined,undefined],[undefined,undefined]] (a,b initialized)
  // [[1,1][0,0],[undefined,undefined],[undefined,undefined]] (b to 1, a to 1)
  // [[2,1],[1,1][0,0],[undefined,undefined]] (b to 2, a to 1)
  // [[2,2],[2,1],[1,1][0,0]] (b to 2, a to 2)
  // [[2,3],[2,2],[2,1],[1,1]]  (b to 2, a to 3)
}, [a, b, simpleHistoryRef, historyRef]);

// in async handle
setA(1);
setA(2);
setA(3);
setB(1);
setB(2);
```

### useTimeRef

Get the effect time of certain dependencies

```typescript
const timeRef = useTimeRef([a, b]);
useEffect(() => {
  // get time of when a,b take effect
  console.log(timeRef.current);
}, [a, b, c, d, e]);
```

## State apis

State apis will take effect in scheduling, be aware of what you are doing

### useStateFromRef

Trans form a ref to a state, by certain dependencies

```typescript
const ref = useRef<any>();
const refState = useStateFromRef(ref, [a, b, c]);
useEffect(() => {
  // will run every [a,b,c] took effect
  console.log(ref.current);
}, [refState]);
```

### useTimer

New trigger by time, get every Date by certain interval

```typescript
// emit new Date every 1000 ms
const timer = useTimer(1000);
useEffect(() => {
  console.log(timer);
  // Fri May 14 2021 16:46:36 GMT+0800
  // Fri May 14 2021 16:46:37 GMT+0800
  // Fri May 14 2021 16:46:38 GMT+0800
  // ...
}, [timer]);
```

## combination

Superior usage, combine multiple schedule refs together

```typescript
const scheduleRef = useScheduleCombine(
  useScheduleFilter(
    [usePreviousRef(a), useStateRef(a)],
    (preA, nowA) => preA !== nowA,
    [a]
  ),
  useStarted()
);

useEffect(() => {
  if (scheduleRef.current) {
    // only run when a changed, and started
  }
}, [a, b, c]);
```

We are doing works to make combination more useful, but now, there is only two combination operations

useScheduleCombine and useFilter
