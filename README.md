# The most comfortable way to handle schedule issue in react hooks

> Support vite, cra, typescript

> Fully eslint support (react-hooks-rules)

## Core API - useInfoRef

```typescript
const [a, setA] = useState(0);
const [b, setB] = useState(0);

// Get schedule information of when 'a' is taking effect
const a$ = useInfoRef(() => a, [a]);

// Get schedule information of a&b combination
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

> This API will get all the schedule information of the **certain state**

> Known if some value changed

```typescript
const a$ = useInfoRef(() => a, [a]);
useEffect(() => {
  if (a$.current.effected) {
    // only run when 'a' take effect
  }
}, [a, b, c, d, e, a$]);
```

> known the count and history of value changes

> The last param is the history length of schedule info, default to 0

```typescript
const a$ = useInfoRef(() => a, [a], 10);
useEffect(() => {
  if (a$.current.history.length > 4) {
    // After 4 times changed
  }
}, [a, a$]);
```

### useStartedRef

Known if the state is initialized

```typescript
const started = useStartedRef();
useEffect(() => {
  if (started.current) {
    // Only run while aStarted current value is true
    // Ignore initialization
  }
}, [a, b, c, started]);
```

### useEndRef

Known if current effect scope destroyed

```typescript
const endRef = useEndRef();
useEffect(() => {
  // Some async handler
  xxx(() => {
    if (endRef.current) {
      // Handle clear
    }
  });
}, []);
```

### useMemoRef

Just like useMemo, but return a ref type value (will never trigger schedule, or make the effect callback run)

```typescript
const aRef = useMemoRef(a);

useEffect(() => {
  console.log(aRef.current === a);
  // true
}, [a, aRef]);
```

> We assume that every application logic can divide into three-part
>
> 1. intent - where **callback and setState** runs, open a logic flow to pass event data, this part is not subject to react scheduling
> 2. model - where **useEffect** takes in charge, the data obtained from the callback will be logically scheduled and processed here
> 3. view - where **useMemo and view** take in charge, display data or provide preparation for starting a new logic flow
>
> Schedule a new logic flow start from the intent period, so delay, debounce, throttle .etc like APIs can only handle the callback, **never use it to state**
>
> (State is the direct source of React scheduling, which will affect useEffect and bring unpredictable consequences)

### useDelay

Call function after a certain delay time(ms)

```typescript
const handleDelay = useCallback((a: string) => a + 1, []);
const [start, close, result, loading] = useDelay(handleDelay, 1000);
// Can pass params (typescript supported)
start("");
// can stop the timeout
close();
// result - the return value of handleDelay
console.log(result); // '1'
// loading - if at the timeout period
console.log(loading); // true
```

### useDebounce

Debounce a function

```typescript
const func = useCallback((a: string) => a + 1, []);
const [debouncedFunc, result, loading] = useDebounce(func, 1000);
```

### useThrottle

Throttle a function

```typescript
const func = useCallback((a: string) => a + 1, []);
const [throttledFunc, result, loading] = useDebounce(func, 1000);
// just use throttledFunc
```

### useDispatch

> Transform event-driven callback call to state-driven, as known as action-dispatch-state mode
>
> A callback call will schedule by React's scheduler, all the synchronous callback calls will be merged into one
>
> You'll get the schedule information of the callback

```typescript
const cb = useCallback((a: string) => a + 1, []);
const [dispatch, action, result] = useDispatch(cb);
useEffect(() => {
  // Do something after cb called
}, [action, anotherCall$]);
dispatch("a");
```

### Action in parent

> Let parent call children callbacks

```typescript
// parent
const [action, dispatch] = useState<ActionType<string>>();
dispatch(() => ["xxx"]);
// action to parentAction

// child
const cb = useCallback((a: string) => a + 1, []);
useEffect(() => {
  // initial action  () => '__initialized__' —— DEFAULT_ACTION
  if (parentAction() !== DEFAULT_ACTION) {
    cb(...parentAction());
  }
}, [parentAction]);

// or make use of useDispatch
const [dispatch, action, result] = useDispatch(cb);
useEffect(() => {
  dispatch(parentAction);
}, [parentAction, dispatch]);
```

# 用最舒服的处理 React 调度问题的工具

> 支持 vite, cra, typescript

> 支持 elints hooks 规则

## Core API - useInfoRef

```typescript
const [a, setA] = useState(0);
const [b, setB] = useState(0);

// 拿到 a 变化后的数据的调度信息
const a$ = useInfoRef(() => a, [a]);

// 拿到 a,b 变化后数据的调度信息
const ab$ = useInfoRef(() => ({ a, b }), [a, b]);

console.log(a$);
/*
{
   value: 1, // 当前值
   pre: 0, // 上一值
   effectTime: 1621318519370, // effect 生效时间
   history:[], // 调度历史
   effected: false // 当前 effect hook 是否生效
}
*/
```

> 这个 api 会拿到 **特定 state** 的所有调度信息

> 比如是否变化

```typescript
const a$ = useInfoRef(() => a, [a]);
useEffect(() => {
  if (a$.current.effected) {
    // 只会在 a 变化的时候执行
  }
}, [a, b, c, d, e, a$]);
```

> 获取变化的历史

> 最后一个参数是 history 调度历史的长度，默认是零 —— 即不打印历史

```typescript
const a$ = useInfoRef(() => a, [a], 10);
useEffect(() => {
  if (a$.current.history.length > 4) {
    // 4 次变更之后执行
  }
}, [a, a$]);
```

### useStartedRef

获取当前 effect hook 是否初始化

```typescript
const started = useStartedRef();
useEffect(() => {
  if (started.current) {
    // 只在 started.current 为 true 时执行
    // 跳过初始化
  }
}, [a, b, c, started]);
```

### useEndRef

获取当前 effect hook 是否销毁

```typescript
const endRef = useEndRef();
useEffect(() => {
  // 一些异步函数调用
  xxx(() => {
    if (endRef.current) {
      // 处理清除
    }
  });
}, []);
```

### useMemoRef

类似 useMemo，但是返回的是 ref 类型数据 (不会影响调度，也就是不会导致 useEffect 调用)

```typescript
const aRef = useMemoRef(a);

useEffect(() => {
  console.log(aRef.current === a);
  // true
}, [a, aRef]);
```

> 我们假设所有应用都可以分为三部分
>
> 1. intent - **callback 和 setState** 运行, 开启一个逻辑流，传递事件数据，这部分不受 react 调度辖制
> 2. model - 由 **useEffect** 主持, 从回调获取的数据，会在这里进行逻辑调度和处理
> 3. view - 由 **useMemo and view** 主持，将数据进行展示，或为开启一个新逻辑流提供准备
>
> 新的逻辑周期调度总是从 intent 阶段开始，因此，类似 delay，debounce，throttle 等逻辑永远针对 callback，不要针对 state 使用它（state 是 React 调度的直接源头，会影响 useEffect 从而带来不可预知的后果）

### useDelay

一定延迟（ms）后调用函数

```typescript
const handleDelay = useCallback((a: string) => a + 1, []);
const [start, close, result, loading] = useDelay(handleDelay, 1000);
// 可以传递参数 (typescript supported)
start("");
// 可以停止
close();
// result - 延迟后的函数返回值
console.log(result); // '1'
// loading - 是否处在 timeout 期间
console.log(loading); // true
```

### useDebounce

防抖

```typescript
const func = useCallback((a: string) => a + 1, []);
const [debouncedFunc, result, loading] = useDebounce(func, 1000);
```

### useThrottle

节流

```typescript
const func = useCallback((a: string) => a + 1, []);
const [throttledFunc, result, loading] = useDebounce(func, 1000);
// just use throttledFunc
```

### useDispatch

> 将事件驱动回调改为数据驱动回调，即 - action-dispatch-state 模式
>
> 回调将会接受 React 调度，即同步的多次回调调用， 只调用最后的那一次
>
> 你可以获取到回调调用的调度信息

```typescript
const cb = useCallback((a: string) => a + 1, []);
const [dispatch, action, result] = useDispatch(cb);
useEffect(() => {
  // 在函数被调用时，做些其他事情
}, [action, anotherCall$]);
dispatch("a");
```

### 父组件的 Action

> 父组件调用子组件函数（通过 action）

```typescript
// 父组件
const [action, dispatch] = useState<ActionType<string>>();
dispatch(() => ["xxx"]);

// action 转化为 parentAction

// 子组件
const cb = useCallback((a: string) => a + 1, []);
useEffect(() => {
  // 初始 action 为 () => '__initialized__' —— DEFAULT_ACTION
  if (parentAction() !== DEFAULT_ACTION) {
    cb(...parentAction());
  }
}, [parentAction]);

// 或者使用 useDispatch
const [dispatch, action, result] = useDispatch(cb);
useEffect(() => {
  dispatch(parentAction);
}, [parentAction, dispatch]);
```
