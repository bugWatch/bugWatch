(function () {
  let bugWatch = {};
  var projectId = '';
  let apiPre = 'https://www.fewatch.com/api';
  bugWatch.report = (config) => {
    projectId = config.projectId;
    let debug = config.debug;
    if (debug == false) return;
    let ignore = config.ignore || '';
    localStorage.setItem('bugwatchProjectId', config.projectId);
    /**
    messag: 错误信息字符串
    source: 发生错误的脚本url
    lineno： 发生错误的行号
    colno:发生错误的列号
    error: Error对象
    */
    window.onerror = function (message, source, lineno, colno, error) {
      if (ignore) {
        const ignoreList = ignore.split(',');
        let isIgnore = false;
        for (var i = 0; i < ignoreList.length; i++) {
          let ignoreKeyword = ignoreList[i];
          if (message.indexOf(ignoreKeyword) > -1) {
            return;
          }
        }
      }
      
      let url = `projectId=${projectId}&time=${new Date()}&message=${message}&source=${source}行号:${lineno}列号:${colno}&pageUrl=${encodeURIComponent(location.href)}
      `
      ;
      if (error) {
        url = `${url}&error=${error.stack}&errorType=${error.name}`;
      }
      fetch(`${apiPre}/bug/addBug?${url}`, {
        method: 'GET',
        mode: 'cors'
        // body: JSON.stringify({
        //   time: new Date(),
        //   url: location.url,
        //   pathname: this.location.pathname,
        //   screen: {
        //       width: this.screen.width,
        //       height: this.screen.height
        //   },
        //   message: message,
        //   source: `${source} 行号：${lineno} 列号：${colno}`,
        //   error: error
        // })
      }).then((res) => {
        // res instanceof Response == true.
        if (res.ok) {
          try {
            res.url = decodeURIComponent(res.url);
            res.json().then((data) => {
              console.log(data.entries);
            });
          } catch (ex) {

          }

        } else {
          console.log("Looks like the response wasn't perfect, got status", res.status);
        }
      })
      .catch((error) => {
        console.log(`这个接口出错了${  error}`);
      });
    };
    window.onload = function () {
      const timing = performance.timing;
      let baiping = timing.domLoading - timing.fetchStart;
      console.log(`白屏时间：${  baiping}`);
    };
  }
  bugWatch.reportAjax = (config => {
     let url = config.config ? config.config.url : '';
    // 发错ajax错误
     fetch(`${apiPre}/bug/addAjaxWatch`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        projectId: projectId,
        message: config.message,
        url: url,
        errorPage: location.href,
        error: config.stack,
        status: config.status,
      }),
    })
    .then((response) => {
      console.log('发出错误监控-来自bugWatch')

    });
  });
  window.bugWatch = bugWatch;
})();
  
