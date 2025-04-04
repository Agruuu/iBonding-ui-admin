import request from '@/config/axios'

export interface OAuth2ClientVO {
  id: number
  clientId: string
  secret: string
  name: string
  logo: string
  description: string
  status: number
  accessTokenValiditySeconds: number
  refreshTokenValiditySeconds: number
  redirectUris: string[]
  autoApprove: boolean
  authorizedGrantTypes: string[]
  scopes: string[]
  authorities: string[]
  resourceIds: string[]
  additionalInformation: string
  isAdditionalInformationJson: boolean
  createTime: Date
}

// query OAuth2 List of clients
export const getOAuth2ClientPage = (params: PageParam) => {
  return request.get({ url: '/system/oauth2-client/page', params })
}

// query OAuth2 Details of the client
export const getOAuth2Client = (id: number) => {
  return request.get({ url: '/system/oauth2-client/get?id=' + id })
}

// add OAuth2 client
export const createOAuth2Client = (data: OAuth2ClientVO) => {
  return request.post({ url: '/system/oauth2-client/create', data })
}

// modify OAuth2 client
export const updateOAuth2Client = (data: OAuth2ClientVO) => {
  return request.put({ url: '/system/oauth2-client/update', data })
}

// delete OAuth2
export const deleteOAuth2Client = (id: number) => {
  return request.delete({ url: '/system/oauth2-client/delete?id=' + id })
}
