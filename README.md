# most comfort way to handle schedule issue in react hooks

> Support vite, cra, typescript

> Fully eslint support (react-hooks-rules)

## Core API - useInfoRef

```typescript
const [a, setA] = useState(0);
const [b, setB] = useState(0);

// get schedule information of a when a is taking effect
const a$ = useInfoRef(() => a, [a]);

// get schedule information of a&b combination
const ab$ = useInfoRef(() => ({ a, b }), [a, b]);

console.log(a$);
/*
{
   value: 1,
   pre: 0,
   effectTime: 1621318519370,
   history:[],
   effected: false
}
*/
```

> this api will get all the schedule information of certain state

> known if some value changed

```typescript
const a$ = useInfoRef(() => a, [a]);
useEffect(() => {
  if (a$.current.effected) {
    // only run when 'a' take effect
  }
}, [a, b, c, d, e, a$]);
```

> known then count of value changes

> the last param is the history length of schedule info, default to 0

```typescript
const a$ = useInfoRef(() => a, [a], 10);
useEffect(() => {
  if (a$.current.history.length > 4) {
    // after 4 times changed
  }
}, [a, a$]);
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

### useMemoRef

Just like useMemo, but return a ref value (will not trigger schedule)

```typescript
const aRef = useMemoRef(a);

useEffect(() => {
  console.log(aRef.current === a);
  // true
}, [a, aRef]);
```

### useDelay

Call function after certain delay time(ms)

```typescript
const handleDelay = useCallback((a: string) => {}, []);
const [start, close] = useDelay(handleDelay, 1000);
// can pass params (typescript supported)
start("");
// can stop the timeout
close();
```

### useDebounce

Debounce logic

```typescript
const func = useCallback((a: string) => {}, []);
const debouncedFunc = useDebounce(func, 1000);
// just use debouncedFunc
```

### useThrottle

Throttle logic

```typescript
const func = useCallback((a: string) => {}, []);
const throttledFunc = useDebounce(func, 1000);
// just use throttledFunc
```
