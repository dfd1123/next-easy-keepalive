# **Next-Easy-KeepAlive (🪄NEKA)**

> We always run into the problem of maintaining the back state, which is an endemic problem of SPA. Various
> problem-solving methods have been suggested, but can't we solve these problems more intuitively and easily?
>
>
> So I created a new KeepAlive library for Nextjs, which implemented the configuration of React as closely as possible.

## **What's good?**

NEKA does not only maintain the state of a specific page, but can record the previous state by assigning both `state`
and `ref` values to each `component`.

NEKA also listens for scroll events that occur on pages that have `component` using the `useKeepAlive` hook and records
the value of `window.scrollY`.
And when it goes back, it adjusts the scroll to the previously recorded scroll position.

As described above, NEKA saves the state and ref values without saving the DOM of the previous page, and configures them
to be set to initial values when initializing the values, reducing the load on the browser and working more naturally.

Even if you record the previous state, it would be more convenient to have a lifeCycleHook that you can use when a
history pop action such as going back occurs and when it does not.
Therefore, NEKA provides a `useBackActive` hook that fires only once when the history pop action first occurs, and
a `useNotBackEffect` hook that fires only once when the history pop action is a push.

Apart from this, NEKA provides several options that developers can easily customize. NEKA is committed to providing a
better user experience, especially in the mobile environment.

## **Getting Started**

1. Enter the next-easy-keepalive installation command as shown below:

```bash
npm i next-easy-keepalive 
# or 
yarn add next-easy-keepalive
```

2. You need to add KeepAliveProvider to `/pages/_app.tsx`. The important thing here is to wrap it right
   outside `<Component {...pageProps} />`.

```js
import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import {KeepAliveProvider} from 'next-easy-keepalive'; // import KeepAliveProvider

export default function App({Component, pageProps}: AppProps) {
  return (
    // should be wrapped right outside <Component ... />
    <KeepAliveProvider>
      <Component {...pageProps} />
    </KeepAliveProvider>
  );
}
```

Now you are all set to use NEKA! It's that simple!!!, right? 😎

Now that you learn how to use the useKeepAlive Hook, you are now free to use the keep-alive feature while using nextjs.
You no longer need to calculate the scroll position of the previous page!

So, let's see how to use it now.

## **How to use useKeepAlive Hook**

---

Get and Call the useKeepAlive hook on the component you want to keep state. (It doesn't matter if it's a page
component.)

```tsx
import Link from "next/link";
import {useKeepAlive} from 'next-easy-keepalive';

export default function Home() {
    /**
     * When using useKeepAlive, you must call it by putting a
     * specific key value in a passing argument.
     * This is because we need to record which component's value we are storing, and also to make debugging easier.
     * It is recommended to include the component function name.
     */
    const {useMemState, useNotBackEffect, useBackActive} = useKeepAlive('Home');

    /**
     * useMemState acts like the useState hook.
     * However, even if the page is moved, it serves to record the previous value.
     */
    const [list, setList] = useMemState<number[]>([], 'list');

    // makeList function to virtually load a list
    const makeList = () => {
        setTimeout(() => {
            const arr = Array.from({length: 1000}, (_, idx) => idx + 1);
            setList(arr)
        }, 500)
    };


    /**
     * The useNotBackEffect hook is executed on first render only if there is no back.
     */
    useNotBackEffect(() => {
        console.log('history pop')
        makeList();
    });

    /**
     * The useBackActive hook is only executed on first render when going back.
     */
    useBackActive(() => {
        console.log('history push')
    });

    return (
        <main>
            <ul>
                {list.map(item => <li key={item}>
                    <Link href={`/${item}`}>{item} page</Link></li>)}
            </ul>
        </main>
    )
}

```

The example above shows how to use `useMemState` to record the state of the current component while playing the same
role as `useState` by calling `useKeepAlive`.

The downside of useKeepAlive is that you have to specify a key value.
However, `these key values can be a strength when debugging`.

![img_1.png](https://user-images.githubusercontent.com/42544793/216341028-7900d703-ba1c-4d13-812f-e5ab4e27db08.png)

In the React component debugging tool, you can trace memState as shown in the image above, but if you want to see the
history of the previous page or more detailed history, click `keepAlive`. It is more convenient to debug because you can
know what state the state is from the key value.

`useKeepAlive` doesn't just record state values, `it can also record ref values!`

```tsx
import Link from "next/link";
import {useKeepAlive} from 'next-easy-keepalive';

export default function Home() {
    const {useMemState, useMemRef, useNotBackEffect} = useKeepAlive('Home');

    /**
     * Just as you put a key value in useState,
     * you also need to put a key value in use MemRef.
     * It is recommended to use the variable name you are using.
     */
    const totalCount = useMemRef(0, 'totalCount');
    const [list, setList] = useMemState<number[]>([], 'list');

    const makeList = () => {
        setTimeout(() => {
            const arr = Array.from({length: 1000}, (_, idx) => idx + 1);
            setList(arr);
            totalCount.current = arr.length; // record number of lists
        }, 500)
    };

    useNotBackEffect(() => {
        makeList();
    });

...
}

```

## **KeepAliveProvider options**

---

Options passed as props of KeepAliveProvider can be regarded as global option settings of keepAlive.

| option         | type                   | default value | description                                                                                                                                                                                                                                                   |
|----------------|------------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| alwaysRemember | `boolean`  `undefined` | `false`       | Determines whether the previously <br/>saved values will be recalled only when going back or forward, <br/>such as the history pop action, or whether the previously recorded values <br/>will be recalled for all pages that have been visited even once.    |
| maxPage        | `number`   `undefined` | `10`          | This option determines the maximum number of keep-alive pages. <br/>The default is 10 pages, and the oldest page record is discarded <br/>when the number of keep-alive pages exceeds the maxPage value. <br/>(maximum is `17`)                               |


For example:
```tsx
//...

export default function App({Component, pageProps}: AppProps) {
  return (
    <KeepAliveProvider maxPage={10} alwaysRemember={true} >
      <Component {...pageProps} />
    </KeepAliveProvider>
  );
}
```


## **useKeepAlive options**

The option value entered as the second argument of the useKeepAlive hook can be regarded as the keepAlive option of each component for which the useKeepAlive hook is used.

| option         | type                   | default value | description                                                                                                                                                                                                 |
|----------------|------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| alwaysRemember | `boolean`  `undefined` | `true`        | An option value that gets the previous state value only if the useKeepAlive hook's alwaysRemember option is set to false, even if the KeepAliveProvider globally sets the alwaysRemember option to true.    |
| keepScroll     | `boolean`  `undefined` | `false`       | This is an optional value that determines whether to save the scroll position value (window.scrollY).                                                                                                       |
| store          | `boolean`  `undefined` | `true`        | An optional value that turns off record operations.                                                                                                                                                         |



## **Simulation**

![img_2.png](https://user-images.githubusercontent.com/42544793/216341346-df699a46-0ff5-4fbb-8e67-ff10c0af02e1.gif)

## **Thanks!**

Contact mail: dfd11233@gmail.com