import NextNamedRoutes from '..'

describe('NextNamedRoutes.pathToRegex', () => {
  it('translates to correct regex', () => {
    expect(NextNamedRoutes.pathToRegex('/').source).toEqual('^\\/$')
    expect(NextNamedRoutes.pathToRegex('/hello').source).toEqual('^\\/hello$')
    //If it fails on the line below, check your node version, Node 12 changed the need for escape characters
    expect(NextNamedRoutes.pathToRegex('/[organizationSlug]/tema/[topicSlug]').source).toEqual(
      '^\\/(?:([^/]+?))\\/tema\\/(?:([^/]+?))$',
    )
  })

  it('regex matches not matching shorter paths', () => {
    expect(NextNamedRoutes.pathToRegex('/[organizationSlug]').test('/')).toBeFalsy()
  })

  it('regex matches paths', () => {
    expect(NextNamedRoutes.pathToRegex('/').test('/')).toBeTruthy()

    expect(NextNamedRoutes.pathToRegex('/[organizationSlug]').test('/test-as')).toBeTruthy()

    expect(
      NextNamedRoutes.pathToRegex('/[organizationSlug]/tema/[topicSlug]').test(
        '/test-as/tema/amazing-stuff-here',
      ),
    ).toBeTruthy()
  })
})
