# most comfort way to handle schedule issue in react hooks

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

Known if state is initialized by certain dependencies

```typescript
const ScopeStarted = useStartedRef([]);
const AStarted = useStartedRef([a]);
const ABCStarted = useStartedRef([a, b, c]);
useEffect(() => {
  if (aStarted.current) {
    // only run while aStarted current value is true
    // ignore initialization
    console.log(aStarted.current);
  }
}, [a, b, c, aStarted]);
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

get mutations history in certain dependencies schedule

```typescript
// default to length with 3
const [a, setA] = useState(0);
const [B, setB] = useState(0);
const simpleHistoryRef = useHistoryRef(a);
const historyRef = useHistoryRef(a, [b], 4);
useEffect(() => {
  console.log(simpleHistoryRef.current);
  // [0,undefined,undefined]
  // [1,0,undefined]
  // [2,1,0]
  // [3,2,1]
  console.log(historyRef.current);
  // [0,undefined,undefined,undefined]
  // [0,undefined,undefined,undefined] (b initialized)
  // [1,0,undefined,undefined] (b to 1, a to 1)
  // [1,0,undefined,undefined] (b to 2, a to 1)
  // [2,1,0,undefined] (b to 2, a to 2)
  // [3,2,1,0] (b to 2, a to 3)
}, [a, b, simpleHistoryRef, historyRef]);

// in async handle
setA(1);
setA(2);
setA(3);
setB(1);
setB(2);
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
