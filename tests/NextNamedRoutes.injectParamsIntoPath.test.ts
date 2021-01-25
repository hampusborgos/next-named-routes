import NextNamedRoutes from '.'

describe('NextNamedRoutes.injectParamsIntoPath', () => {
  it('inject named parameters', () => {
    expect(NextNamedRoutes.injectParamsIntoPath('/hello', {})).toEqual('/hello')

    expect(
      NextNamedRoutes.injectParamsIntoPath('/[organizationSlug]', {
        organizationSlug: 'test-as',
      }),
    ).toEqual('/test-as')

    expect(
      NextNamedRoutes.injectParamsIntoPath(
        '/[organizationSlug]/tema/[topicSlug]',
        {
          organizationSlug: 'test-as',
          topicSlug: 'amazing-Journey',
        },
      ),
    ).toEqual('/test-as/tema/amazing-Journey')
  })
})
