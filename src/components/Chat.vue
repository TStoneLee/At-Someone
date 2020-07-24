<template>
  <div>
    <div>
      <div ref="editor" id="editor" @keydown="enterEv($event)"></div>

      <div class="bullet-box" :style="{left:left+'px',top:top+'px',visibility:showFlag}">
          <input type="text" id="searchPersonInput" v-model="personSearchText" @blur="missFocus()">
          <ul>
            <li @click="selectPerson(item.display_name,item.user_id)" class="list" :id="`user${item.user_id}`" :data-id="item.user_id" v-for="(item,index) in searchResult" :key="index">{{item.display_name}}</li>
            <!-- <li @click="select" class="list" :id="`user${item.user_id}`" :data-id="item.user_id" v-for="(item,index) in contactList" :key="index">{{item.display_name}}</li> -->
          </ul>
      </div>
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
import { Tools } from '../assets/common'
import { position, offset } from 'caret-pos'
export default {
  data () {
    return {
      editorContent: '',
      editor: '',
      uploadObj: {},
      enclosure_list: [],
      contactList: [],
      left: '',
      top: '',
      browserType: Tools.browserType(),
      showFlag: 'hidden',
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
    searchResult () {
      const result = []
      this.contactList.map(item => {
        if (item.display_name.search(this.personSearchText) !== -1) {
          result.push(item)
        }
      })
      return result
    }
  },
  mounted () {
    let editor = new E('#editor')
    editor.customConfig.onchange = (html) => {
      // console.log(html)
      this.editorContent = html
    }
    editor.create()
    this.editor = editor
  },
  methods: {
    enterEv (e) {
      //keydown触发事件
      // console.log(e)
      this.personSearchText = ''
      let ele = this.editor.$textElem[0].firstChild
      let selection = getSelection()
      // console.log(selection)
      if ((e.keyCode === 229 || e.keyCode === 50) && e.shiftKey) {
        // 兼容
        e.preventDefault ? e.preventDefault() : e.returnValue = false
        this.position = {
          range: selection.getRangeAt(0),
          selection: selection
        }
        try {
          if (this.editor.$textElem[0].firstChild.firstChild.tagName === "BR") {
            this.editor.$textElem[0].firstChild.removeChild(this.editor.$textElem[0].firstChild.firstChild)
          }
        } catch (e) {
          console.log(e)
        }
        let fakeNode = document.createElement('span')
        fakeNode.className = 'fake-at'
        fakeNode.innerHTML = '@'
        this.position.range.insertNode(fakeNode)
        this.position.selection.collapse(fakeNode, 1)
        this.getPosition()
        this.showFlag = 'visible'
        setTimeout(() => {
          document.getElementById('searchPersonInput').focus()
        },100)
      } else if (e.code === 'Backspace' || e.key === 'Backspace') {
        // e.preventDefault()
        //  let selection = getSelection()
        let range = selection.getRangeAt(0)
        let removeNode = null
        if (this.browserType === 'Firefox') {
          console.log(range)
          if (range.startContainer.className !== "at-text") {
            removeNode = range.startContainer.previousElementSibling
            console.dir('Firefox previousElementSibling',removeNode)
          }
          if (range.startContainer.parentElement.className !== "at-text" && range.startContainer.lastChild !== null) {
            removeNode = range.startContainer.lastElementChild.previousElementSibling
            console.dir('Firefox lastElementChild.previousElementSibling', removeNode)
          }
        }
        if (this.browserType === 'Chrome') {
          if (range.startContainer.textContent.length === 1 && range.startContainer.textContent.trim() === '') {
            removeNode = range.startContainer.previousElementSibling
            // console.dir(removeNode)
          }
          if (range.startContainer.parentNode.className === 'at-text') {
            e.preventDefault ? e.preventDefault() : e.returnValue = false
            removeNode = range.startContainer.parentNode
          }
        }
        if (this.browserType === "IE") {

          if (range.startContainer.nodeName !== "P" && range.startContainer.nodeValue.trim() === "" && range.startContainer.previousSibling.className === "at-text") {
            removeNode = range.startContainer.previousSibling
            console.log('parentElement',removeNode)
          }
          if (range.startContainer.parentNode.className === "at-text" && range.startContainer.nodeName === '#text' && range.startContainer.previousSibling == null) {
            removeNode = range.startContainer.parentNode
            console.log('parentNode', removeNode)
          }
        }
        if (removeNode) {
          ele.removeChild(removeNode)
        }
        this.showFlag = 'hidden'
      }
    },
    //选人
    selectPerson (name,id) {
      this.showFlag = 'hidden'
      let selection = this.position.selection
      let range = this.position.range
      // console.log(range)
        // range.deleteContents()
      // 生成需要显示的内容，包括一个 span 和一个空格。
      let spanNode1 = document.createElement('span')
      let spanNode2 = document.createElement('span')
      spanNode1.className = 'at-text'
      spanNode1.innerHTML = '@' + name
      spanNode1.dataset.id = id
      spanNode2.innerHTML = '&nbsp'

      // 将生成内容打包放在 Fragment 中，并获取生成内容的最后一个节点，也就是空格。
      let frag = document.createDocumentFragment(),
          node, lastNode
      frag.appendChild(spanNode1)
      while ((node = spanNode2.firstChild)) {
          lastNode = frag.appendChild(node)
      }
      // 将 Fragment 中的内容放入 range 中，并将光标放在空格之后。
      range.insertNode(frag)
      selection.collapse(lastNode, 1)
      let fakeAtNode = document.querySelector('.fake-at')
      if (fakeAtNode) {
        this.editor.$textElem[0].firstChild.removeChild(fakeAtNode)
      }
      selection.collapseToEnd()

    },
    //获取@位置
    getPosition () {
      this.showFlag = 'visible'
      const ele = this.editor.$textElem[0]
      const childEle = document.getElementsByClassName("bullet-box")[0]
      // console.log(childEle)
      let parentW = ele.offsetWidth
      let parentH = ele.offsetHeight
      let childW = childEle.offsetWidth
      let childH = childEle.offsetHeight
      const pos = position(ele)
      const off = offset(ele)
      // 弹框偏移超出父元素的宽高
      if (parentW - pos.left < childW) {
        this.left = off.left - childW
      } else {
        this.left = off.left
      }
      // if (parentH - pos.top < childH) {
      //   this.top = off.top -childH
      // } else {
      this.top = off.top+20
      // }
    },
    missFocus: function () {
      setTimeout(function () {
        this.showFlag = 'hidden'
      }, 10)
    }
  }
}
</script>

<style scoped>
  .bullet-box {
    width:10%;
    max-height: 200px;
    position: absolute;
    padding: 10px;
    border: 1px solid #c1c6cc;
    background-color: #fff;
    z-index: 10000;
    overflow: auto;
    border-radius: 4px;
  }
  .bullet-box input {
    display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 1;
    margin-bottom: 5px;
    font-size: 16px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    background-image: none;
    position: relative;
  }
  .list {
    padding: 5px;
  }

  ul {
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;
  }
  li:hover{
    background: #C9DBF2;
  }
</style>
