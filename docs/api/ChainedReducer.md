---
id: ChainedReducer
title: ChainedReducer
hide_title: true
sidebar_label: ChainedReducer
---

# ChainedReducer
Chained reducers allows you build a reducer using method chaining.  
It utilizes [immer](https://github.com/mweststrate/immer) hence state mutations are allowed. 


---

## Methods
### `constructor`
#### Arguments
1. `initialState: object`- the initial state.

```ts
import { ChainedReducer } from 'typeless';

new ChainedReducer({ foo: 'bar' })
```


### `attach(prop, reducer)` 
Attach a child reducer at the given path.  
The child reducer will be only scoped to the nested state `State[prop]`.
#### Arguments
1. `prop: string` - the property name.
2. `reducer: Reducer` - the reducer to attach.
#### Returns
`{ChainedReducer}` - this reducer.

#### Example

```tsx
interface Nested {
  foo: string;
}

interface State {
  sub: Nested;
}

const subReducer = new ChainedReducer({ foo: 'bar' } as Nested);

const reducer = new ChainedReducer(initialState as State)
  .attach('sub', subReducer);
```

----

### `on(actionCreator, fn)` 
Attach a handler for the specific action creator. The action creator is a function generated by `createModule`.  
#### Arguments
1. `actionCreator: ActionCreator` - the action creator.
2. `handler: (state, payload, action) => void`  
  The function handler with the following parameters:
   - `state: object` - the reducer state.
   - `payload: object` - the action payload. The type is inferred automatically from ActionCreator.
   - `action: object` - the original action.  
#### Returns
`{ChainedReducer}` - this reducer.

#### Example

```ts
// interface.ts
import { createModule } from 'typeless';
import { UserSymbol } from './symbol';

const [handle, UserActions] = createModule(UserSymbol)
  .withActions({
    loadUser: (id: number) => ({ payload: { id } }),
    userLoaded: (user: User) => ({ payload: { user } }),
  });

// module.ts
import { handle, UserActions } from './interface';

interface State {
  user: User | null;
}
const initialState: State = {
  user: null,
};

handle
  .reducer(initialState)
  .on(UserActions.userLoaded, (state, { user }) => {
    state.user = user;
  });
```


---

### `onMany(actionCreators[], handler)`
Attach a handler for multiple action creators. This function is very similar to `on`.
#### Arguments
1. `actionCreators: ActionCreator[]` - the action creators to match.
2. `handler: (state, payload, action) => EpicResult`  
#### Returns
`{ChainedReducer}` - this reducer.

#### Example

```ts
// interface.ts
import { createModule } from 'typeless';
import { UserSymbol } from './symbol';

const [handle, UserActions] = createModule(UserSymbol)
  .withActions({
    userLoaded: (user: User) => ({ payload: { user } }),
    userUpdated: (user: User) => ({ payload: { user } }),
  });

// module.ts
import { handle, UserActions } from './interface';

interface State {
  user: User | null;
}
const initialState: State = {
  user: null,
};

handle
  .reducer(initialState)
  .onMany(
    [UserActions.userLoaded, UserActions.userUpdated],
    (state, { user }) => {
      state.user = user;
    }
  );
```

----

### `replace(actionCreator, fn)` 
Attach a handler for the specific action creator and replace the whole state.  
#### Arguments
1. `actionCreator: ActionCreator` - the action creator. Under the hood it checks `actionCreator.toString() === action.type`.
2. `handler: (state, payload, action) => object`  
  The function handler must return a new state object.
#### Returns
`{ChainedReducer}` - this reducer.

#### Example
```ts
// interface.ts
import { createModule } from 'typeless';
import { UserSymbol } from './symbol';

const [handle, UserActions] = createModule(UserSymbol)
  .withActions({
    reset: null,
  });

// module.ts
import { handle, UserActions } from './interface';

interface State {
  user: User | null;
}
const initialState: State = {
  user: null,
};

handle
  .reducer(initialState)
  .replace(UserActions.reset, () => initialState);
```


### `nested(prop, fn)` 
Create a child reducer at the given path.  
The child reducer will be only scoped to the nested state `State[prop]`.
#### Arguments
1. `prop: string` - the property name.
1. `fn: (reducer: Reducer) => Reducer` - the function to create a new reducer.
#### Returns
`{ChainedReducer}` - this reducer.

#### Example

```ts
// interface.ts
import { createModule } from 'typeless';
import { UserSymbol } from './symbol';

const [handle, UserActions] = createModule(UserSymbol)
  .withActions({
    reset: null,
    setFilter: (filter: string) => ({ payload: { filter } }),
  });

// module.ts
import { handle, UserActions } from './interface';

interface State {
  foo: string;
  search: {
    filter: string;
  };
}

const initialState: State = {
  foo: 'bar',
  search: {
    filter: '',
  },
};

handle
  .reducer(initialState)
  .nested('search', searchReducer =>
    searchReducer.on(UserActions.setFilter, (state, { filter }) => {
      state.filter = filter;
    })
  );
```