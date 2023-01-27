/**
 * [axios error handling](https://axios-http.com/docs/handling_errors)
 * 
 * 오류의 응답/요청/요청 설정 상황에 따른 에러 발생 처리
 * @param {AxiosResponse} error 
 */
export function handleAxiosError(error) {
  // Axios Error Handling
  // 출처: https://axios-http.com/docs/handling_errors
  // if (error.response) {
  //   // 요청은 이루어졌으나 서버로부터 2xx 범위 벗어나는 응답 받았을 때
  //   throw new Response({ status: error.response.status, statusText: error.response.statusText });
  // } else if (error.message) {
  //   // 요청 설정 중, 또는 요청은 하였으나 응답을 받지 못한 오류
  //   throw new Response({ status: 400, statusText: error.message });
  // }
}