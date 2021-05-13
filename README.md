# most comfort way to handle schedule issue in react hooks

## Ref apis

all the ref apis must be used like this below:

```typescript
const xxx = useXxx(dep);
// xxx must be also in dependencyList
// because this type of api is just an assistant of schedule
useEffect(() => {
  // all of them are ref
  if (xxx.current) {
    // ...
  }
}, [dep, xxx]);
// useCallback,useMemo are in the same use
```

### useStarted

Known if state is initialized

```typescript
const aStarted = useStarted(a);
useEffect(() => {
  if (aStarted.current) {
    // only run while aStarted current value is true
    // ignore initialization
    console.log(aStarted.current);
  }
}, [a, b, c, aStarted]);
```

### usePrevious

Get the previous value of certain state

```typescript
const [a, setA] = useState(0);
const aPrevious = usePrevious(a);
useEffect(() => {
  console.log(aPrevious.current, a);
}, [a, aPrevious]);
// setInEvent
setA((res) => ++res);
// undefined 0
// 0 1
// 1 2
// ...
```

### useChanged

Known if value changed in **this effect callback , or aka event loop**

```typescript
const aChanged = useChanged(a);
const bChanged = useChanged(b);
// seperate the schedule of useEffect/useMemo/useCallback's dependencies
useEffect(() => {
  if (aChanged.current) {
    console.log("only run when a changed");
  }
  if (bChanged.current) {
    console.log("only run when b changed");
  }
}, [a, b, aChanged, bChanged]);
```

### useChangedAfter

Just like useChanged, but ignore of initialization

```typescript
const [a, setA] = useState(0);
const aChangedAfter = useChanged(a);
useEffect(() => {
  if (aChangedAfter.current) {
    // with setter as setA(res=>++res)
    // console will never be 0, and nerve be the same
    console.log(a);
  }
}, [a, aChangedAfter]);
```

### useChangedCount

Get the count of change already happened

```typescript
const aChangeCount = useChangedCount(a);
useEffect(() => {
  console.log(aChangeCount.current);
}, [a, b, c, aChangeCount]);
```

### useChangeDuration

Get the duration time after last change

```typescript
const aChangeDuration = useChangeDuration(a);
useEffect(() => {
  // -1 means not initialized, you cannot get it in useEffect
  // 0 means initialized time,
  // strictly, it will be 18-20 ms for the initialization
  // but for performance reason, we set it to 0
  // other timestamp means the duration ms time after last change of certain state
  console.log(aChangeDuration.current);
}, [a, aChangeDuration]);
```

## State apis

Just use it directly

### useFilter

Ignore value and schedule in certain condition

```typescript
const aFiltered = useFilter(a, (res) => res !== undefined);
useEffect(() => {
  // never be undefined
  console.log(aFiltered);
}, [aFiltered]);
```

### useConditionEl

Use it in the return value of FC component

Update when dependencies scheduled

```typescript
// views and children of current component
// will scheduled by certain dependencies
function SomeCompo() {
  const [a, setA] = useState(0);
  return useConditionEl(
    <div>
      {a}
      <ChildCompo />
    </div>,
    [a]
  );
}
```
