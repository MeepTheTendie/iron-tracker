/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as dailyHabits from '../dailyHabits.js'
import type * as exercises from '../exercises.js'
import type * as seed from '../seed.js'
import type * as workoutExerciseMutations from '../workoutExerciseMutations.js'
import type * as workoutLogs from '../workoutLogs.js'
import type * as workoutMutations from '../workoutMutations.js'
import type * as workouts from '../workouts.js'

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from 'convex/server'

declare const fullApi: ApiFromModules<{
  dailyHabits: typeof dailyHabits
  exercises: typeof exercises
  seed: typeof seed
  workoutExerciseMutations: typeof workoutExerciseMutations
  workoutLogs: typeof workoutLogs
  workoutMutations: typeof workoutMutations
  workouts: typeof workouts
}>

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, 'public'>
>

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, 'internal'>
>

export declare const components: {}
