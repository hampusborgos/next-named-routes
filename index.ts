// TODO: Support match [...rest] style paths (we don't use them currently)
const nextStylePathComponent = /\[[^/]+\]/g

type Route<RouteName> = {
  name: RouteName
  identifiers: string[]
  path: string
  regex: RegExp
}

class NextNamedRoutes<RouteName> {
  routes: Route<RouteName>[] = []

  add(name: RouteName, path: string): NextNamedRoutes<RouteName> {
    if (this.findRouteByName(name)) {
      throw new Error(`Duplicate route added: ${name}`)
    }

    this.routes.push({
      name,
      identifiers: NextNamedRoutes.identifiersInPath(path),
      path,
      regex: NextNamedRoutes.pathToRegex(path),
    })
    return this
  }

  activeRoute(): Route<RouteName> {
    const rn = this.findRouteByPath(window.location.pathname)
    if (!rn) {
      throw new Error(`No route associated with this pathname: ${window.location.pathname}`)
    }
    return rn
  }

  findRouteByName(name: RouteName): Route<RouteName> | undefined {
    return this.routes.find((route) => route.name === name)
  }

  findRouteByPath(path: string): Route<RouteName> | undefined {
    return this.routes.find((route) => route.regex.test(path))
  }

  /**
   * Returns the pathname (what is visible in URL bar) for the given route and parameters
   * @param name The route to render.
   * @param params The parameters that should be injected into the route
   */
  pathnameForParams(name: RouteName, params: { [key: string]: string }): string {
    const route = this.findRouteByName(name)
    if (!route) {
      throw new Error(`Could not find route: ${name}`)
    }

    return NextNamedRoutes.injectParamsIntoPath(route.path, params)
  }

  static injectParamsIntoPath(nextStylePath: string, params: { [key: string]: string }): string {
    const identifiers = NextNamedRoutes.identifiersInPath(nextStylePath)
    const pathname = identifiers.reduce((prev, curr) => {
      return prev.replace(`[${curr}]`, params[curr])
    }, nextStylePath)

    // Add any search params to the route
    const searchParams = Object.keys(params).filter((key) => !identifiers.includes(key))
    let searchParamString = ''
    if (searchParams.length > 0) {
      searchParams.forEach((key) => {
        if (params[key]) {
          if (searchParamString.length === 0) {
            searchParamString = '?'
          } else if (searchParamString.length > 1) {
            searchParamString += '&'
          }
          searchParamString += encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }
      })
    }

    return pathname + searchParamString
  }

  static pathToRegex(nextStylePath: string): RegExp {
    const escapedPath = nextStylePath.replace(/[-{}()*+?.,\\^$|#\s]/g, '\\$&')
    const identifiers = NextNamedRoutes.identifiersInPath(escapedPath)

    // Create a regex using the identifiers
    return new RegExp(
      '^' +
        identifiers.reduce((prev, curr) => {
          return prev.replace(`[${curr}]`, '(?:([^/]+?))')
        }, nextStylePath) +
        '$',
    )
  }

  static identifiersInPath(nextStylePath: string): string[] {
    const matches = []

    // string.matchAll is not standard enough yet :(
    nextStylePathComponent.lastIndex = 0
    let m = nextStylePathComponent.exec(nextStylePath)
    while (m) {
      matches.push(m[0])
      m = nextStylePathComponent.exec(nextStylePath)
    }

    // Check for duplicates before returning, better be safe than sorry
    const seen: { [key: string]: boolean } = {}
    return matches.map((m) => {
      const id = m.substr(1, m.length - 2)
      if (seen[id]) {
        throw new Error(`Duplicate identifier in path ${nextStylePath}: ${id}`)
      }
      seen[id] = true
      return id
    })
  }
}

export default NextNamedRoutes
