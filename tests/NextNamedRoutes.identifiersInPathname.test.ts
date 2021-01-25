import NextNamedRoutes from '.'

describe('NextNamedRoutes.identifiersInPath', () => {
  it('should split out identifiers', () => {
    expect(NextNamedRoutes.identifiersInPath('/')).toEqual([])

    expect(NextNamedRoutes.identifiersInPath('/[organizationSlug]')).toEqual([
      'organizationSlug',
    ])

    expect(
      NextNamedRoutes.identifiersInPath('/[organizationSlug]/tema/[topicSlug]'),
    ).toEqual(['organizationSlug', 'topicSlug'])
  })

  it('should reject duplicate identifiers', () => {
    expect(() =>
      NextNamedRoutes.identifiersInPath(
        '/[organizationSlug]/[organizationSlug]',
      ),
    ).toThrow()
  })
})
