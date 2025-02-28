const config: {
  base_url: string
  result_code: number | string
  default_headers: AxiosHeaders
  request_timeout: number
} = {
  /**
   * api Request basic path
   */
  base_url: import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL,
  /**
   * Interface successfully returns status code
   */
  result_code: 200,

  /**
   * Interface request timeout
   */
  request_timeout: 30000,

  /**
   * Default interface request type
   * Optional values：application/x-www-form-urlencoded multipart/form-data
   */
  default_headers: 'application/json'
}

export { config }
