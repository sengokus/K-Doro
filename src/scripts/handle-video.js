$('#ytvideo').each(function(){
    this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
});