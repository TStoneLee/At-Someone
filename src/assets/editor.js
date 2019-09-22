export function Editor(container){
    var currentRange,_parentElem,supportRange = typeof document.createRange === 'function'
    function getCurrentRange() {
        var selection,range,txt=container
        if(supportRange){
            selection = document.getSelection()
            if (selection.getRangeAt && selection.rangeCount) {
                range = document.getSelection().getRangeAt(0)
                _parentElem = range.commonAncestorContaine
                // commonAncestorContaine startContainer 和 endContainer 共同的祖先节点在文档树位置最深的那个
            }
        }else{
            range = document.selection.createRange()
            if(range){
                _parentElem = range.parentElement() // 类似commonAncestorContaine
            }
        }
        if( _parentElem && txt === _parentElem){
            // parentElem = _parentElem
            return range
        }
        return range
    }
    function saveSelection() {
        currentRange = getCurrentRange()
    }
    this.getRange=function(){
        return currentRange
    }
    this.insertImage=function(html){
        this.restoreSelection()
        if(document.selection)
            currentRange.pasteHTML(html)
        else{
            container.focus()
            document.execCommand('insertHtml',false,html)
            currentRange.collapse()
        }
        saveSelection()
    }
    this.restoreSelection=function(){
        if(!currentRange){
            return
        }
        var selection,range
        if(supportRange){
            selection = document.getSelection()
            selection.removeAllRanges()
            selection.addRange(currentRange)
        }else{
            range = document.selection.createRange()
            range.setEndPoint('EndToEnd', currentRange)
            if(currentRange.text.length === 0){
                range.collapse(false)
            }else{
                range.setEndPoint('StartToStart', currentRange)
            }
            range.select()
        }
    }
    this.callFn = function() {
        saveSelection()
    }
  // avalon.bind(container,'mouseup',function(e){
  //     saveSelection()
  // })
  // avalon.bind(container,'keyup',function(e){
  //     saveSelection()
  // })
}
