
const Tools = {
    //判断浏览器的类型
  browserType() {
    let userAgent = navigator.userAgent;
    let isOpera = userAgent.indexOf('Opera') > -1;
    let isIE = !!window['ActiveXObject'] || 'ActiveXObject' in window;
    let isEdge = userAgent.indexOf('Edge') > -1;
    let isFF = userAgent.indexOf('Firefox') > -1;
    let isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1;
    let isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 && !isEdge;
    if (isOpera) { return 'Opera'; }
    if (isIE) { return 'IE' }
    if (isEdge) { return 'Edge' }
    if (isFF) { return 'Firefox' }
    if (isSafari) { return 'Safari' }
    if (isChrome) { return 'Chrome' }
  }
}

export { Tools }
