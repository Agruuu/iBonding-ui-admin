import request from '@/config/axios'

// Get authorization information
export const getAuthorize = (clientId: string) => {
  return request.get({ url: '/system/oauth2/authorize?clientId=' + clientId })
}

// Initiate authorization
export const authorize = (
  responseType: string,
  clientId: string,
  redirectUri: string,
  state: string,
  autoApprove: boolean,
  checkedScopes: string[],
  uncheckedScopes: string[]
) => {
  // structure scopes
  const scopes = {}
  for (const scope of checkedScopes) {
    scopes[scope] = true
  }
  for (const scope of uncheckedScopes) {
    scopes[scope] = false
  }
  // Initiate a request
  return request.post({
    url: '/system/oauth2/authorize',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state,
      auto_approve: autoApprove,
      scope: JSON.stringify(scopes)
    }
  })
}
