<template>
  <div>
    <div id="editor" class="m-b-sm" @keydown="enterEv($event)"></div>
    <div class="bullet-box" :style="{left:left+'px',top:top+'px',visibility:showFlag}">
      <input class="ivu-input" style="width: 100%; hieght: 5px;margin-bottom: 5px;" type="text" id="searchPersonInput" v-model="personSearchText" @blur="missFocus()">
      <ul>
        <li @click="selectPerson(item.display_name,item.user_id)" class="list" :id="`user${item.user_id}`" :data-id="item.user_id" v-for="(item,index) in searchResult" :key="index">{{item.display_name}}</li>
        <!-- <li @click="select" class="list" :id="`user${item.user_id}`" :data-id="item.user_id" v-for="(item,index) in contactList" :key="index">{{item.display_name}}</li> -->
      </ul>
    </div>
  </div>
</template>

<script>
  import E from 'wangeditor'
  import { position, offset } from 'caret-pos'
  import { Editor }  from '../assets/editor'
  export default {
    name: 'editor',
    data () {
      return {
        editor: null,
        editorContent: '',
        left: '',
        top: '',
        showFlag: 'hidden',
        at_editor: null,
        personSearchText: '',
        contactList:[
                    {
                        "user_id":1,
                        "login_name":"admin",
                        "display_name":"admin123",
                        "organization_id":1,
                        "email":"",
                        "status":"NORMAL"
                    },
                    {
                        "user_id":3,
                        "login_name":"aaa2",
                        "display_name":"啊啊2啊",
                        "organization_id":1,
                        "email":"",
                        "status":"NORMAL"
                    },
                    {
                        "user_id":7,
                        "login_name":"djy",
                        "display_name":"打酱油",
                        "organization_id":1,
                        "email":"",
                        "status":"NORMAL"
                    },
                    {
                        "user_id":9,
                        "login_name":"admin",
                        "display_name":"大明",
                        "organization_id":3,
                        "email":"",
                        "status":"NORMAL"
                    },
                    {
                        "user_id":13,
                        "login_name":"123",
                        "display_name":"12",
                        "organization_id":3,
                        "email":"",
                        "status":"NORMAL"
                    }
                ]
      }
    },
    computed: {
        searchResult() {
            const result = [];
            this.contactList.map(item => {
                if (item.display_name.search(this.personSearchText) !== -1) {
                    result.push(item)
                }
            })
            return result;
        }
    },
    methods: {
      enterEv(e) {
          //keydown触发事件
          // console.log(e)
          this.personSearchText = '';
          let ele = this.editor.$textElem[0].firstChild
          let selection = getSelection();
          // console.log(ele)
          // console.log(selection)
          if ((e.keyCode === 229 || e.keyCode === 50) && e.shiftKey) {
              this.position = {
                  range: selection.getRangeAt(0),
                  selection: selection
              }
              // console.log(this.position.range.startContainer.parentElement.children.length)
              // console.log(this.position.range)
              this.getPosition();
              this.showFlag = 'visible'
              setTimeout(() => {
                  document.getElementById('searchPersonInput').focus();
              },100)
          } else if (e.code === 'Backspace' || e.key === 'Backspace') {
              // 删除逻辑
              // 1 ：由于在创建时默认会在 @xxx 后添加一个空格，
              // 所以当得知光标位于 @xxx 之后的一个第一个字符后并按下删除按钮时，
              // 应该将光标前的 @xxx 给删除
              // 2 ：当光标位于 @xxx 中间时，按下删除按钮时应该将整个 @xxx 给删除。
              // e.preventDefault();
              //  let selection = getSelection();
              let range = selection.getRangeAt(0);
              let removeNode = null;
              console.log(range)
              console.log(range.startContainer.previousElementSibling)
              if (this.browserType === 'Firefox') {
                  if (range.startOffset <= 1 && range.startContainer.parentElement.className !== "at-text") {
                      removeNode = range.startContainer.previousElementSibling;
                      console.log('Firefox previousElementSibling',removeNode)
                  }
                  if (range.startContainer.parentElement.className !== "at-text" && range.startContainer.lastChild !== null) {
                      removeNode = range.startContainer.lastElementChild.previousElementSibling;
                      console.log('Firefox lastElementChild.previousElementSibling', removeNode)
                  }
              }
              if (this.browserType === 'Chrome') {
                  if (range.startOffset <= 1 && range.startContainer.parentElement.className !== "at-text") {
                      removeNode = range.startContainer.previousElementSibling;
                      console.log('Chrome previousElementSibling',removeNode)
                  }
                  if (range.startContainer.parentElement.className === "at-text") {
                      removeNode = range.startContainer.parentElement;
                      console.log('Chrome parentElement',removeNode)
                  }

                  if (range.startContainer.textContent.trim() === '') {
                      // console.log(range)
                      removeNode = range.startContainer.previousElementSibling;
                      // console.dir(removeNode)
                  }
              }
              if (this.browserType === "IE") {
                  console.log(range)
                  // console.dir(range.startContainer.nodeValue)
                  // if (range.startContainer.parentNode.className !== "at-text") {
                  //   removeNode = range.startContainer.previousElementSibling;
                  //   console.log('previousElementSibling',removeNode)
                  // }
                  if (range.startContainer.nodeName !== "P" && range.startContainer.nodeValue.trim() === "" && range.startContainer.previousSibling.className === "at-text") {
                      removeNode = range.startContainer.previousSibling;
                      console.log('parentElement',removeNode)
                  }
                  if (range.startContainer.parentNode.className === "at-text" && range.startContainer.nodeName === '#text' && range.startContainer.previousSibling == null) {
                      removeNode = range.startContainer.parentNode;
                      console.log('parentNode', removeNode)
                  }
              }

              // if (range.startContainer.parentElement.className !== "at-text") {
              //   removeNode = range.startContainer.previousElementSibling;
              //   console.log('previousElementSibling',removeNode)
              // }
              // if (range.startContainer.parentElement.className === "at-text") {
              //   removeNode = range.startContainer.parentElement;
              //   console.dir(removeNode)
              // }
              // if (range.startContainer.textContent.trim() === '') {
              //   console.log(range)
              //   removeNode = range.startContainer.previousElementSibling;
              //   console.dir(removeNode)
              // }
              if (removeNode) {
                  ele.removeChild(removeNode);
              }
              this.showFlag = 'hidden'
              // if (range.startContainer.parentElement.className === 'w-e-text') {
              //   console.log('w-e-text')
              //   selection.collapse(range.startContainer,1)
              // }
          }
    },
      //选人
      selectPerson(name,id) {
          this.showFlag = 'hidden'
          let selection = this.position.selection;
          let range = this.position.range;
          // console.log(range)
          let textNode = range.startContainer;
          // console.log(range.startContainer)
          // console.dir(textNode)
          let hasWhite;
          let whiteCount;
          if (textNode.nodeName !== 'P') {
              whiteCount = range.startContainer.nodeValue.replace(/\S/g, '').length;
              hasWhite = range.startContainer.nodeValue.endsWith(' @');
              console.log(whiteCount)
              // console.log('range.startContainerNodeValue',range.startContainer.nodeValue.endsWith(' @'))
          }
          // console.log(whiteCount, 'whiteCount')
          // 删除 @ 符号。
          // if (textNode.nodeName == 'P' && range.endOffset === 1) {
          //     console.log(range.endOffset)
          //     range.setStart(textNode, range.endOffset-1);
          //     range.setEnd(textNode, range.endOffset);
          // } else {
          //   range.setStart(textNode, range.endOffset);
          //   range.setEnd(textNode, range.endOffset + 1);
          // }
          if (this.browserType === 'IE') {
              console.log('IE other')
              if (textNode.nodeName == '#text' && hasWhite && whiteCount === 1) {
                  console.log('IE #text')
                  range.setStart(textNode, range.endOffset + 1);
                  range.setEnd(textNode, range.endOffset + 1);
              } else if (textNode.nodeName == '#text' && hasWhite && whiteCount > 1) {
                  console.log('IE #text > 1')
                  range.setStart(textNode, range.endOffset + 1);
                  range.setEnd(textNode, range.endOffset + 2);
              } else {
                  range.setStart(textNode, range.endOffset);
                  range.setEnd(textNode, range.endOffset + 1);
              }
          }
          if (this.browserType === 'Chrome' || this.browserType === 'Edge' || this.browserType === 'Safari') {
              if (textNode.nodeName == 'P' && range.endOffset === 1) {
                  console.log('Chrome P')
                  // console.log(range.endOffset)
                  range.setStart(textNode, range.endOffset-1);
                  range.setEnd(textNode, range.endOffset);
              } else if (textNode.nodeName == '#text' && hasWhite && whiteCount === 1) {
                  console.log('Chrome #text')
                  range.setStart(textNode, range.endOffset + 1);
                  range.setEnd(textNode, range.endOffset + 1);
              } else if (textNode.nodeName == '#text' && hasWhite && whiteCount > 1) {
                  console.log('Chrome #text > 1')
                  range.setStart(textNode, range.endOffset + 1);
                  range.setEnd(textNode, range.endOffset + 2);
              } else {
                  console.log('Chrome other')
                  range.setStart(textNode, range.endOffset);
                  range.setEnd(textNode, range.endOffset + 1);
              }
          } else if (this.browserType === 'Firefox') {
              // if (textNode.nodeName == 'P' && range.endOffset === 1) {
              //   console.log('firefox P')
              //   // console.log(range.endOffset)
              //   range.setStart(textNode, range.endOffset-1);
              //   range.setEnd(textNode, range.endOffset);
              // } else {
              console.log('Firefox other')
              range.setStart(textNode, range.endOffset);
              range.setEnd(textNode, range.endOffset + 1);

          } else {
              // if (textNode.nodeName == 'P' && range.endOffset === 1) {
              //   console.log('P')
              //   // console.log(range.endOffset)
              //   range.setStart(textNode, range.endOffset-1);
              //   range.setEnd(textNode, range.endOffset);
              // } else if (textNode.nodeName == '#text' && hasWhite && whiteCount === 1) {
              //   console.log('#text')
              //   range.setStart(textNode, range.endOffset + 1);
              //   range.setEnd(textNode, range.endOffset + 1);
              // } else if (textNode.nodeName == '#text' && hasWhite && whiteCount > 1) {
              //   console.log('#text > 1')
              //   range.setStart(textNode, range.endOffset + 1);
              //   range.setEnd(textNode, range.endOffset + 2);
              // } else {
              //   console.log('other')
              //   range.setStart(textNode, range.endOffset);
              //   range.setEnd(textNode, range.endOffset + 1);
              // }
          }
          range.deleteContents();
          // 生成需要显示的内容，包括一个 span 和一个空格。
          let spanNode1 = document.createElement('span');
          let spanNode2 = document.createElement('span');
          spanNode1.className = 'at-text';
          spanNode1.innerHTML = '@' + name;
          spanNode1.dataset.id = id;
          spanNode2.innerHTML = '&nbsp;';

          // 将生成内容打包放在 Fragment 中，并获取生成内容的最后一个节点，也就是空格。
          let frag = document.createDocumentFragment(),
              node, lastNode;
          frag.appendChild(spanNode1);
          while ((node = spanNode2.firstChild)) {
              lastNode = frag.appendChild(node);
          }

          // 将 Fragment 中的内容放入 range 中，并将光标放在空格之后。
          range.insertNode(frag);
          // console.log(frag)
          // console.log(range.toString())
          // console.log(lastNode)
          // selection.extend(lastNode, 1);
          selection.collapse(lastNode, 1)
          selection.collapseToEnd();
      },
      //获取@位置
      getPosition() {
          this.showFlag = 'visible';
          const ele = this.editor.$textElem[0]
          const childEle = document.getElementsByClassName("bullet-box")[0]
          // console.log(childEle)
          let parentW = ele.offsetWidth;
          let parentH = ele.offsetHeight;
          let childW = childEle.offsetWidth;
          let childH = childEle.offsetHeight;
          const pos = position(ele)
          const off = offset(ele)
          // 弹框偏移超出父元素的宽高
          if (parentW - pos.left < childW) {
              this.left = off.left - childW;
          } else {
              this.left = off.left;
          }
          // if (parentH - pos.top < childH) {
          //   this.top = off.top -childH;
          // } else {
          this.top = off.top+20;
          // }
      },
      missFocus: function() {
          setTimeout(function() {
              this.showFlag = 'hidden'
          }, 10);
      }
    },
    mounted() {
        //富文本编辑器初始化
        this.editor = new E('#editor');
        this.editor.customConfig.onchange = (html) => {
            // console.log(html)
            this.editorContent = html
        };
        this.editor.create()
    }
  }
</script>

<style scoped>
  ul {padding: 0;}
  .bullet-box {
    width:10%;
    max-height: 200px;
    position: absolute;
    padding: 8px;
    border: 1px solid #c1c6cc;
    background-color: #fff;
    z-index: 10000;
    overflow: auto;
    border-radius: 4px;
  }
  .list {
    padding: 5px;
  }
  li {
    list-style: none;
  }
  li:hover{
    background: #C9DBF2;
    cursor: pointer;
  }
</style>
