# next-named-routes

A supporting library to [NextJS 10+](https://nextjs.org/) that allows you to programatically handle routes in your application.

*Does currently not support i18n routing* – https://nextjs.org/docs/advanced-features/i18n-routing
*Does currently not support catch all routes* – https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes

(PRs welcome)

# Use case

This library should be used, if you find the need to for example iterate all routes in your application at run time, or detect which route
is currently active.

As the default NextJS has no "names" for the routes you add, it is very tricky and hacky to make this work without some additional support this library provides. Use case here can be for example that you have dynamic links in your application to other pages, and would like to know which page in the route this corresponds to (to render it in a popover, as an example).

# API

The library exports a single class `NextNamedRoutes` with the following methods:

In TypeScript, `NextNamedRoutes` takes a type argument that should be an enum of all routes in your application. This enum is referred to as `RouteName` below.

The following helper type is also exported by the library as return value from several functions:

```
type Route<RouteName> = {
  name: RouteName // Name of the routes, as provided to `add`
  identifiers: string[] // Any dynamic parts of the route. So the route /[threadId]/messages[messageId] will return ['threadId', 'messageId']
  path: string // The second input to `add`
  regex: RegExp // A regex, that can be used to match against `window.pathname` or a `href` starting with `/` to see if it leads to this route.
}
```

- `add(name: RouteName, path: string)` – Register a name to the route referred to by `path`. `path` should be specified with the file system path to the route in NextJS, with a leading slash but without the file extension. For example, `/[threadId]/messages/[messageId]` is a valid path argument as long as the file `/pages/[threadId]/messages/[messageId].ts` exists. The method returns the `this` object so you can chain multiple calls.
- `activeRoute(): RouteName` – Returns the `RouteName` of the route that is currently active. Very useful for highlighting the current route in the menu for example.
- `findRouteByName(name: RouteName): Route<RouteName> | undefined` – Returns the metadata for a route given its name.
- `findRouteByPath(path: string): Route<RouteName> | undefined` – Takes a path (of the form `window.pathname`) and returns the metadata for the matching route.
- `pathnameForParams(name: RouteName, params: { [key: string]: string })` – Returns a pathname suitable for passing as `href` to an `a` element for a route (or setting `window.href = ...`). The `params` argument is any dynamic parts of the path that should be injected.
- `routes: RouteName[]` – List of all routes added to the router.

# Possible extensions

* Full i18n support as supported by Next: https://nextjs.org/docs/advanced-features/i18n-routing
* Support catch all routes: https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
* On server side – detect against the file system that `path` actually maps to a valid NextJS path, else throw an error to prevent typing errors.