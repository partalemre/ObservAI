import { http, HttpResponse } from 'msw'
// Minimal user shape used in the app
const baseUser = {
  id: 'u-demo',
  name: 'Demo User',
  role: 'owner',
  stores: [
    { id: 's1', name: 'Coffee Bar' },
    { id: 's2', name: 'Downtown Kiosk' },
  ],
}
export const handlers = [
  // Accept demo/owner with ANY password
  http.post('*/auth/login', async ({ request }) => {
    const { email } = await request.json()
    if (email === 'demo@obs.ai' || email === 'owner@obs.ai') {
      return HttpResponse.json({
        token: 'dev-mock-token',
        user: { ...baseUser, email },
      })
    }
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }),
  // Current user
  http.get('*/me', () => {
    return HttpResponse.json({
      user: {
        ...baseUser,
        email: 'demo@obs.ai',
        roles: ['owner'],
      },
      orgs: [{ id: 'o1', name: 'Demo Organization' }],
      stores: [
        { id: 's1', name: 'Coffee Bar', orgId: 'o1' },
        { id: 's2', name: 'Downtown Kiosk', orgId: 'o1' },
      ],
    })
  }),
]
