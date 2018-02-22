export class UrlQueryHelper {

  public static getQueryValues() {
    const query = window.location.search.substring(1);
    const params = query.split("&");
    const returnValue = {};
    for (const p of params) {
      const pair = p.split("=");
      if (pair.length === 2) {
        returnValue[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
    }
    return returnValue;
  }

  /**
   * Joins the different url params together.
   * @param {string} params the params to join, already in the correct format and url encoded!
   * @return {string} If params not empty, a url query string starting with ?.
   */
  public static join(...params) {
    let queryString = "";
    for (const param of params) {
      if (param) {
        if (!queryString) {
          queryString = "?";
        }
        queryString += param;
        queryString += "&";
      }
    }
    return queryString.substring(0, queryString.length - 1);
  }

  /**
   * Creates an url with the current url and the given params.
   * @param {object} params the parameters for the search query.
   * @return {string} the created url;
   */
  public static setParams(params: object) {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const path = window.location.pathname;
    const paramsArray: string[] = [];
    for (const k of Object.keys(params)) {
      paramsArray.push(`${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`);
    }
    const joinedParams = UrlQueryHelper.join(...paramsArray);
    return `${protocol}//${host}${path}${joinedParams}`;
  }
}
